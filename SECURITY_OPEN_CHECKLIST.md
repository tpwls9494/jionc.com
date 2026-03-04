# Security Launch Checklist

Last updated: 2026-03-04

## P0: Must Finish Before Public Launch

- [ ] Lock OAuth frontend redirect to a trusted value from server config only.
- [ ] Stop sending access tokens in query strings; use URL fragment (`#`) at minimum.
- [ ] Rotate all production secrets:
  - [ ] `SECRET_KEY`
  - [ ] database password
  - [ ] Redis password (if enabled)
  - [ ] SMTP credentials
  - [ ] OAuth client secrets
- [ ] Remove tracked production env files from git index:
  - [ ] `.env.production`
  - [ ] `backend/.env.production`
- [ ] Ensure `/docs` and `/openapi.json` return `404` in production.
- [ ] Disable sensitive token/code logging in auth email flows.
- [ ] Restrict or protect `/health/detailed` (internal-only, auth, or IP allowlist).

## P1: Should Finish Within 24 Hours

- [ ] Remove `http://` origins from production `CORS_ORIGINS`.
- [ ] Tighten CSP `connect-src` to known domains only.
- [ ] Run backend and nginx containers as non-root users.
- [ ] Confirm log retention and access control policy.
- [ ] Verify automated DB backups and run one restore test.

## Runtime Verification (Production Host)

- [ ] `docker compose -f docker-compose.prod.yml ps` shows all services healthy.
- [ ] `curl -I https://<domain>/docs` returns `404`.
- [ ] `curl -I https://<domain>/openapi.json` returns `404`.
- [ ] `curl -s https://<domain>/health` returns healthy response.
- [ ] OAuth login success path works and final callback URL contains no `?token=`.
