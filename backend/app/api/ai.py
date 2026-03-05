import time
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_optional
from app.crud.ai_action_log import create_ai_action_log
from app.db.session import get_db
from app.models.user import User
from app.schemas.ai import (
    AiChatRequest,
    AiChatResponse,
    AiEditorMaskResponse,
    AiEditorProofreadResponse,
    AiEditorRequest,
    AiEditorTagsResponse,
    AiEditorTemplateResponse,
    AiEditorTitleResponse,
    AiRouteRequest,
    AiRouteResponse,
)
from app.services.ai_service import (
    INTENT_DEV_QNA,
    INTENT_EDITOR_HELP,
    INTENT_OUT_OF_SCOPE,
    INTENT_SITE_HELP,
    ai_service,
)

router = APIRouter()

CHAT_ALLOWED_INTENTS = {INTENT_DEV_QNA, INTENT_SITE_HELP, INTENT_OUT_OF_SCOPE}
ALL_INTENTS = {INTENT_DEV_QNA, INTENT_SITE_HELP, INTENT_EDITOR_HELP, INTENT_OUT_OF_SCOPE}


def _identity_key(request: Request, current_user: User | None) -> str:
    if current_user:
        return f"user:{current_user.id}"
    client_host = request.client.host if request.client else "unknown"
    return f"ip:{client_host}"


def _safe_log(
    db: Session,
    *,
    user_id: int | None,
    endpoint: str,
    source: str,
    intent: str | None,
    action: str | None,
    input_hash: str | None,
    status_text: str,
    model: str | None = None,
    latency_ms: float | None = None,
    prompt_tokens: int | None = None,
    completion_tokens: int | None = None,
    total_tokens: int | None = None,
    cost_usd: float | None = None,
    error_message: str | None = None,
) -> None:
    create_ai_action_log(
        db,
        user_id=user_id,
        endpoint=endpoint,
        source=source,
        intent=intent,
        action=action,
        input_hash=input_hash,
        status=status_text,
        model=model,
        latency_ms=latency_ms,
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=total_tokens,
        cost_usd=cost_usd,
        error_message=error_message,
    )


def _require_rate_limit(
    *,
    endpoint: str,
    request: Request,
    db: Session,
    current_user: User | None,
    source: str,
    action: str | None,
    input_hash: str,
) -> None:
    identity = _identity_key(request, current_user)
    if ai_service.allow_request(endpoint, identity):
        return
    _safe_log(
        db,
        user_id=current_user.id if current_user else None,
        endpoint=endpoint,
        source=source,
        intent=None,
        action=action,
        input_hash=input_hash,
        status_text="rate_limited",
        error_message="Too many AI requests",
    )
    raise HTTPException(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        detail="Too many AI requests. Please retry in a minute.",
    )


def _split_meta(payload: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    copied = dict(payload)
    meta = copied.pop("_meta", {}) or {}
    return copied, meta


@router.post("/route", response_model=AiRouteResponse)
def route_ai_intent(
    payload: AiRouteRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    input_hash = ai_service.build_input_hash(
        {
            "endpoint": "route",
            "source": payload.source,
            "action": payload.action,
            "message": payload.message,
        }
    )
    _require_rate_limit(
        endpoint="route",
        request=request,
        db=db,
        current_user=current_user,
        source=payload.source,
        action=payload.action,
        input_hash=input_hash,
    )

    cache_key = f"route:{input_hash}"
    cached = ai_service.get_cached(cache_key)
    if cached:
        response = AiRouteResponse(**cached, cached=True)
        _safe_log(
            db,
            user_id=current_user.id if current_user else None,
            endpoint="route",
            source=payload.source,
            intent=response.intent,
            action=payload.action,
            input_hash=input_hash,
            status_text="cached",
        )
        return response

    start = time.perf_counter()
    decision_raw = ai_service.classify_intent(
        message=payload.message,
        source=payload.source,
        action=payload.action,
        allowed_intents=ALL_INTENTS,
        allow_model=True,
    )
    decision, meta = _split_meta(decision_raw)
    response = AiRouteResponse(**decision, cached=False)
    ai_service.set_cached(cache_key, response.model_dump(exclude={"cached"}))
    elapsed_ms = (time.perf_counter() - start) * 1000

    _safe_log(
        db,
        user_id=current_user.id if current_user else None,
        endpoint="route",
        source=payload.source,
        intent=response.intent,
        action=payload.action,
        input_hash=input_hash,
        status_text=str(meta.get("status") or "success"),
        model=meta.get("model"),
        latency_ms=float(meta.get("latency_ms") or elapsed_ms),
        prompt_tokens=int(meta.get("prompt_tokens") or 0),
        completion_tokens=int(meta.get("completion_tokens") or 0),
        total_tokens=int(meta.get("total_tokens") or 0),
        cost_usd=float(meta.get("cost_usd") or 0.0),
        error_message=meta.get("error_message"),
    )
    return response


@router.post("/chat", response_model=AiChatResponse)
def chat_ai(
    payload: AiChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    input_hash = ai_service.build_input_hash(
        {
            "endpoint": "chat",
            "source": payload.source,
            "message": payload.message,
        }
    )
    _require_rate_limit(
        endpoint="chat",
        request=request,
        db=db,
        current_user=current_user,
        source=payload.source,
        action=None,
        input_hash=input_hash,
    )

    cache_key = f"chat:{input_hash}"
    cached = ai_service.get_cached(cache_key)
    if cached:
        response = AiChatResponse(**cached, cached=True)
        _safe_log(
            db,
            user_id=current_user.id if current_user else None,
            endpoint="chat",
            source=payload.source,
            intent=response.intent,
            action=None,
            input_hash=input_hash,
            status_text="cached",
        )
        return response

    start = time.perf_counter()
    decision_raw = ai_service.classify_intent(
        message=payload.message,
        source=payload.source,
        action=None,
        allowed_intents=CHAT_ALLOWED_INTENTS,
        allow_model=True,
    )
    decision, route_meta = _split_meta(decision_raw)
    intent = decision["intent"]
    reply, model_result = ai_service.chat_reply(intent=intent, message=payload.message)

    response = AiChatResponse(
        source=payload.source,
        intent=intent,  # type: ignore[arg-type]
        answer=reply["answer"],
        suggested_question=(
            reply.get("suggested_question")
            if intent == INTENT_OUT_OF_SCOPE
            else None
        ),
        out_of_scope=intent == INTENT_OUT_OF_SCOPE,
        cached=False,
    )
    ai_service.set_cached(cache_key, response.model_dump(exclude={"cached"}))
    elapsed_ms = (time.perf_counter() - start) * 1000

    # Route meta reflects optional low-cost route model call.
    route_latency = float(route_meta.get("latency_ms") or 0.0)
    total_latency = elapsed_ms + route_latency
    status_text = model_result.status
    if intent == INTENT_OUT_OF_SCOPE:
        status_text = "success"

    _safe_log(
        db,
        user_id=current_user.id if current_user else None,
        endpoint="chat",
        source=payload.source,
        intent=intent,
        action=None,
        input_hash=input_hash,
        status_text=status_text,
        model=model_result.model,
        latency_ms=round(total_latency, 2),
        prompt_tokens=model_result.prompt_tokens,
        completion_tokens=model_result.completion_tokens,
        total_tokens=model_result.total_tokens,
        cost_usd=model_result.cost_usd,
        error_message=model_result.error_message,
    )
    return response


def _handle_editor_action(
    *,
    action: str,
    payload: AiEditorRequest,
    request: Request,
    db: Session,
    current_user: User | None,
) -> dict[str, Any]:
    if payload.action != action:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"action must be '{action}'",
        )

    input_hash = ai_service.build_input_hash(
        {
            "endpoint": f"editor:{action}",
            "source": payload.source,
            "action": payload.action,
            "title": payload.title,
            "text": payload.text,
            "category_slug": payload.category_slug,
        }
    )
    _require_rate_limit(
        endpoint=f"editor:{action}",
        request=request,
        db=db,
        current_user=current_user,
        source=payload.source,
        action=payload.action,
        input_hash=input_hash,
    )

    cache_key = f"editor:v2:{action}:{input_hash}"
    cached = ai_service.get_cached(cache_key)
    if cached:
        cached_payload = {**cached, "cached": True}
        _safe_log(
            db,
            user_id=current_user.id if current_user else None,
            endpoint=f"editor:{action}",
            source=payload.source,
            intent=INTENT_EDITOR_HELP,
            action=action,
            input_hash=input_hash,
            status_text="cached",
        )
        return cached_payload

    start = time.perf_counter()
    data, model_result = ai_service.editor_reply(
        action=action,
        text=payload.text,
        title=payload.title,
        category_slug=payload.category_slug,
    )
    elapsed_ms = (time.perf_counter() - start) * 1000

    if model_result.status not in {"success", "recovered_non_json"}:
        _safe_log(
            db,
            user_id=current_user.id if current_user else None,
            endpoint=f"editor:{action}",
            source=payload.source,
            intent=INTENT_EDITOR_HELP,
            action=action,
            input_hash=input_hash,
            status_text=model_result.status,
            model=model_result.model,
            latency_ms=round(elapsed_ms + model_result.latency_ms, 2),
            prompt_tokens=model_result.prompt_tokens,
            completion_tokens=model_result.completion_tokens,
            total_tokens=model_result.total_tokens,
            cost_usd=model_result.cost_usd,
            error_message=model_result.error_message,
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI 생성 결과를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        )

    response_payload = {
        "source": payload.source,
        "intent": INTENT_EDITOR_HELP,
        "action": action,
        **data,
        "cached": False,
    }
    ai_service.set_cached(cache_key, {**response_payload, "cached": False})

    _safe_log(
        db,
        user_id=current_user.id if current_user else None,
        endpoint=f"editor:{action}",
        source=payload.source,
        intent=INTENT_EDITOR_HELP,
        action=action,
        input_hash=input_hash,
        status_text=model_result.status,
        model=model_result.model,
        latency_ms=round(elapsed_ms + model_result.latency_ms, 2),
        prompt_tokens=model_result.prompt_tokens,
        completion_tokens=model_result.completion_tokens,
        total_tokens=model_result.total_tokens,
        cost_usd=model_result.cost_usd,
        error_message=model_result.error_message,
    )
    return response_payload


@router.post("/editor/proofread", response_model=AiEditorProofreadResponse)
def editor_proofread(
    payload: AiEditorRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    return _handle_editor_action(
        action="proofread",
        payload=payload,
        request=request,
        db=db,
        current_user=current_user,
    )


@router.post("/editor/title", response_model=AiEditorTitleResponse)
def editor_title(
    payload: AiEditorRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    return _handle_editor_action(
        action="title",
        payload=payload,
        request=request,
        db=db,
        current_user=current_user,
    )


@router.post("/editor/template", response_model=AiEditorTemplateResponse)
def editor_template(
    payload: AiEditorRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    return _handle_editor_action(
        action="template",
        payload=payload,
        request=request,
        db=db,
        current_user=current_user,
    )


@router.post("/editor/tags", response_model=AiEditorTagsResponse)
def editor_tags(
    payload: AiEditorRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    return _handle_editor_action(
        action="tags",
        payload=payload,
        request=request,
        db=db,
        current_user=current_user,
    )


@router.post("/editor/mask", response_model=AiEditorMaskResponse)
def editor_mask(
    payload: AiEditorRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    return _handle_editor_action(
        action="mask",
        payload=payload,
        request=request,
        db=db,
        current_user=current_user,
    )
