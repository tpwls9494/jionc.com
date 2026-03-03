import hashlib
from datetime import datetime, timedelta, timezone

from app.api.v1 import auth as auth_api
from app.core.config import settings
from app.db.base import Base, engine
from app.db.session import SessionLocal
from app.models.email_verification_token import EmailVerificationToken
from app.models.user import User


def _reset_db() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def _register_user(client, email: str, username: str, password: str = "password123"):
    return client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "username": username,
            "password": password,
        },
    )


def _login_user(client, email: str, password: str = "password123") -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def test_unverified_user_cannot_create_post(client):
    _reset_db()
    register_response = _register_user(client, "verify-block@example.com", "verify-block-user")
    assert register_response.status_code == 201
    assert register_response.json()["email_verified"] is False

    access_token = _login_user(client, "verify-block@example.com")
    create_response = client.post(
        "/api/v1/posts/",
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "title": "blocked",
            "content": "blocked",
            "category_id": 1,
        },
    )

    assert create_response.status_code == 403
    assert "Email verification is required" in create_response.json()["detail"]


def test_verify_email_success_and_reuse(client):
    _reset_db()
    email = "verify-success@example.com"
    register_response = _register_user(client, email, "verify-success-user")
    assert register_response.status_code == 201

    raw_token = "known-token-success"
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        assert user is not None
        db.add(
            EmailVerificationToken(
                user_id=user.id,
                token_hash=token_hash,
                expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
            )
        )
        db.commit()

    verify_response = client.post("/api/v1/auth/verify-email", json={"token": raw_token})
    assert verify_response.status_code == 200
    assert verify_response.json()["detail"] == "Email verified successfully"

    reused_response = client.post("/api/v1/auth/verify-email", json={"token": raw_token})
    assert reused_response.status_code == 400

    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        token_row = db.query(EmailVerificationToken).filter(EmailVerificationToken.token_hash == token_hash).first()
        assert user is not None
        assert token_row is not None
        assert user.email_verified is True
        assert user.email_verified_at is not None
        assert token_row.used_at is not None


def test_verify_email_expired_token(client):
    _reset_db()
    email = "verify-expired@example.com"
    register_response = _register_user(client, email, "verify-expired-user")
    assert register_response.status_code == 201

    raw_token = "known-token-expired"
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        assert user is not None
        db.add(
            EmailVerificationToken(
                user_id=user.id,
                token_hash=token_hash,
                expires_at=datetime.now(timezone.utc) - timedelta(minutes=1),
            )
        )
        db.commit()

    verify_response = client.post("/api/v1/auth/verify-email", json={"token": raw_token})
    assert verify_response.status_code == 400
    assert "Invalid or expired verification token" in verify_response.json()["detail"]


def test_resend_verification_rate_limit_returns_same_response(client, monkeypatch):
    _reset_db()
    email = "resend-rate@example.com"
    register_response = _register_user(client, email, "resend-rate-user")
    assert register_response.status_code == 201

    auth_api._EMAIL_RESEND_ATTEMPTS_BY_KEY.clear()
    monkeypatch.setattr(settings, "EMAIL_VERIFICATION_RESEND_MAX_ATTEMPTS", 1)
    monkeypatch.setattr(settings, "EMAIL_VERIFICATION_RESEND_WINDOW_SECONDS", 3600)

    sent_count = {"value": 0}

    def _fake_send_verification(db, user):
        _ = db
        _ = user
        sent_count["value"] += 1

    monkeypatch.setattr(auth_api, "_send_email_verification_for_user", _fake_send_verification)

    first = client.post("/api/v1/auth/resend-verification", json={"email": email})
    second = client.post("/api/v1/auth/resend-verification", json={"email": email})
    missing = client.post("/api/v1/auth/resend-verification", json={"email": "missing@example.com"})

    assert first.status_code == 200
    assert second.status_code == 200
    assert missing.status_code == 200
    assert first.json() == second.json() == missing.json()
    assert sent_count["value"] == 1
