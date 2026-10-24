from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.api.dependencies import check_rate_limit, get_current_user
from app.core.config import settings
from app.core.errors import ForbiddenError, NotFoundError
from app.repositories.db_adapter import db
from app.schemas.ai import (
    AIChatRequest,
    AIChatResponse,
    AIConversationResponse,
    AIMessageResponse,
)
from app.schemas.profile import ProfileResponse
from app.services.document_service import document_service
from app.services.gemini_service import gemini_service

router = APIRouter(tags=["Gemini AI Research Assistant"])


@router.post("/ai/chat", response_model=AIChatResponse)
async def chat_with_assistant(
    payload: AIChatRequest,
    current_user: ProfileResponse = Depends(get_current_user),
):
    """
    Contextual chat with the Gemini AI Research Assistant.
    Supports optional conversation ID and optional document context.
    """
    check_rate_limit(f"ai:{current_user.id}", max_requests=settings.AI_RATE_LIMIT_PER_MINUTE)

    doc_context = None
    if payload.document_id:
        doc = await db.get_document(str(payload.document_id))
        if not doc:
            raise NotFoundError("Specified document not found.")
        is_owner = str(doc.get("owner_id")) == str(current_user.id)
        is_public = doc.get("access_scope") == "public"
        if not (is_owner or is_public or current_user.role == "admin"):
            raise ForbiddenError("You do not have access to discuss this document.")
        doc_context = await document_service.get_document_text(payload.document_id)

    # Conversation setup
    conv_id = payload.conversation_id
    history = []
    if conv_id:
        conv = await db.get_ai_conversation(str(conv_id))
        if not conv:
            raise NotFoundError("AI Conversation not found.")
        if str(conv.get("user_id")) != str(current_user.id) and current_user.role != "admin":
            raise ForbiddenError("Unauthorized conversation access.")
        history = conv.get("messages", [])
    else:
        new_conv = await db.create_ai_conversation({
            "user_id": str(current_user.id),
            "document_id": str(payload.document_id) if payload.document_id else None,
            "title": f"Discussion: {payload.message[:40]}...",
        })
        conv_id = UUID(new_conv["id"])

    # Record user message
    await db.create_ai_message({
        "conversation_id": str(conv_id),
        "sender_type": "user",
        "content": payload.message,
    })

    # Call Gemini service
    res = await gemini_service.chat(
        user_message=payload.message,
        conversation_history=history,
        document_context=doc_context,
    )

    # Record AI message
    created_msg = await db.create_ai_message({
        "conversation_id": str(conv_id),
        "sender_type": "assistant",
        "content": res["content"],
        "citations": res.get("citations", []),
    })

    return AIChatResponse(
        conversation_id=conv_id,
        message=res["content"],
        sender_type="assistant",
        citations=res.get("citations", []),
        created_at=datetime.fromisoformat(created_msg["created_at"]),
    )


@router.get("/ai/conversations", response_model=List[AIConversationResponse])
async def list_conversations(
    current_user: ProfileResponse = Depends(get_current_user),
):
    """
    Lists the current user's past AI assistant conversations.
    """
    items = await db.list_ai_conversations(str(current_user.id))
    return [AIConversationResponse(**c) for c in items]


@router.get("/ai/conversations/{conversation_id}", response_model=AIConversationResponse)
async def get_conversation(
    conversation_id: UUID,
    current_user: ProfileResponse = Depends(get_current_user),
):
    """
    Retrieves full chat message history for an AI conversation.
    """
    conv = await db.get_ai_conversation(str(conversation_id))
    if not conv:
        raise NotFoundError("Conversation not found.")

    if str(conv.get("user_id")) != str(current_user.id) and current_user.role != "admin":
        raise ForbiddenError("You do not have access to this conversation.")

    return AIConversationResponse(**conv)


@router.post(
    "/ai/conversations/{conversation_id}/messages",
    response_model=AIChatResponse,
    status_code=status.HTTP_201_CREATED,
)
async def append_message_to_conversation(
    conversation_id: UUID,
    payload: AIChatRequest,
    current_user: ProfileResponse = Depends(get_current_user),
):
    """
    Appends a new turn to an existing conversation thread.
    """
    payload.conversation_id = conversation_id
    return await chat_with_assistant(payload, current_user)
