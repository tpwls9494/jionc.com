from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.ai_action_log import AiActionLog


def create_ai_action_log(
    db: Session,
    *,
    user_id: int | None,
    endpoint: str,
    source: str,
    intent: str | None,
    action: str | None,
    input_hash: str | None,
    status: str,
    model: str | None = None,
    latency_ms: float | None = None,
    prompt_tokens: int | None = None,
    completion_tokens: int | None = None,
    total_tokens: int | None = None,
    cost_usd: float | None = None,
    error_message: str | None = None,
) -> None:
    try:
        db.add(
            AiActionLog(
                user_id=user_id,
                endpoint=endpoint,
                source=source,
                intent=intent,
                action=action,
                input_hash=input_hash,
                status=status,
                model=model,
                latency_ms=latency_ms,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                cost_usd=cost_usd,
                error_message=error_message,
            )
        )
        db.commit()
    except SQLAlchemyError:
        db.rollback()
