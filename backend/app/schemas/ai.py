from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator


AI_INTENT = Literal["DEV_QNA", "SITE_HELP", "EDITOR_HELP", "OUT_OF_SCOPE"]
AI_SOURCE = Literal["sidebar_chat", "editor_action"]
AI_EDITOR_ACTION = Literal["proofread", "title", "template", "tags", "mask"]


class AiRouteRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    source: AI_SOURCE = "sidebar_chat"
    action: Optional[AI_EDITOR_ACTION] = None


class AiRouteResponse(BaseModel):
    intent: AI_INTENT
    confidence: float = Field(..., ge=0.0, le=1.0)
    reason: str
    method: Literal["rule", "model", "fallback"] = "rule"
    cached: bool = False


class AiChatRequest(BaseModel):
    source: Literal["sidebar_chat"] = "sidebar_chat"
    message: str = Field(..., min_length=1, max_length=4000)


class AiChatResponse(BaseModel):
    source: Literal["sidebar_chat"] = "sidebar_chat"
    intent: Literal["DEV_QNA", "SITE_HELP", "OUT_OF_SCOPE"]
    answer: str
    suggested_question: Optional[str] = None
    out_of_scope: bool = False
    cached: bool = False


class AiEditorRequest(BaseModel):
    source: Literal["editor_action"] = "editor_action"
    action: AI_EDITOR_ACTION
    text: str = Field(default="", max_length=20000)
    title: Optional[str] = Field(default=None, max_length=255)
    category_slug: Optional[str] = Field(default=None, max_length=50)

    @model_validator(mode="after")
    def ensure_enough_context(self):
        if not self.text.strip() and not (self.title or "").strip():
            raise ValueError("text or title is required")
        return self


class AiEditorProofreadResponse(BaseModel):
    source: Literal["editor_action"] = "editor_action"
    intent: Literal["EDITOR_HELP"] = "EDITOR_HELP"
    action: Literal["proofread"] = "proofread"
    revised_text: str
    changes: list[str] = Field(default_factory=list)
    note: Optional[str] = None
    cached: bool = False


class AiEditorTitleResponse(BaseModel):
    source: Literal["editor_action"] = "editor_action"
    intent: Literal["EDITOR_HELP"] = "EDITOR_HELP"
    action: Literal["title"] = "title"
    titles: list[str] = Field(default_factory=list)
    rationale: Optional[str] = None
    cached: bool = False


class AiEditorTemplateResponse(BaseModel):
    source: Literal["editor_action"] = "editor_action"
    intent: Literal["EDITOR_HELP"] = "EDITOR_HELP"
    action: Literal["template"] = "template"
    template: str
    checklist: list[str] = Field(default_factory=list)
    cached: bool = False


class AiEditorTagsResponse(BaseModel):
    source: Literal["editor_action"] = "editor_action"
    intent: Literal["EDITOR_HELP"] = "EDITOR_HELP"
    action: Literal["tags"] = "tags"
    tags: list[str] = Field(default_factory=list)
    cached: bool = False


class AiEditorMaskResponse(BaseModel):
    source: Literal["editor_action"] = "editor_action"
    intent: Literal["EDITOR_HELP"] = "EDITOR_HELP"
    action: Literal["mask"] = "mask"
    masked_text: str
    redactions: list[str] = Field(default_factory=list)
    cached: bool = False
