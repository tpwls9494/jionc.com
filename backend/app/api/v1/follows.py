from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_current_user_optional
from app.crud import follow as crud_follow
from app.crud import user as crud_user
from app.db.session import get_db
from app.models.user import User
from app.models.user_follow import UserFollow
from app.schemas.follow import (
    BlockResponse,
    FollowResponse,
    FollowStatusResponse,
    FollowUserListResponse,
    FollowUserSummary,
)

router = APIRouter()


def _get_user_or_404(db: Session, user_id: int) -> User:
    user = crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )
    return user


def _build_follow_user_list_response(
    rows: list[tuple[User, UserFollow]],
    total: int,
    page: int,
    page_size: int,
) -> FollowUserListResponse:
    users = [
        FollowUserSummary(
            user_id=user.id,
            username=user.username,
            profile_image_url=user.profile_image_url,
            followed_at=follow.created_at,
        )
        for user, follow in rows
    ]
    return FollowUserListResponse(
        total=total,
        page=page,
        page_size=page_size,
        users=users,
    )


@router.post("/users/{user_id}", response_model=FollowResponse, status_code=status.HTTP_201_CREATED)
def follow_user(
    user_id: int,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_user_or_404(db, user_id)

    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="자기 자신은 팔로우할 수 없습니다.",
        )

    if crud_follow.is_blocked_between(db, current_user.id, user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="차단 관계에서는 팔로우할 수 없습니다.",
        )

    existing_follow = crud_follow.get_follow(
        db,
        follower_id=current_user.id,
        following_id=user_id,
    )
    if existing_follow:
        response.status_code = status.HTTP_200_OK
        return existing_follow

    try:
        return crud_follow.create_follow(
            db,
            follower_id=current_user.id,
            following_id=user_id,
        )
    except IntegrityError:
        db.rollback()
        existing_follow = crud_follow.get_follow(
            db,
            follower_id=current_user.id,
            following_id=user_id,
        )
        if existing_follow:
            response.status_code = status.HTTP_200_OK
            return existing_follow
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="팔로우 처리에 실패했습니다.",
        )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_user_or_404(db, user_id)
    crud_follow.delete_follow(
        db,
        follower_id=current_user.id,
        following_id=user_id,
    )
    return None


@router.delete("/users/{user_id}/follower", status_code=status.HTTP_204_NO_CONTENT)
def remove_follower(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_user_or_404(db, user_id)

    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="본인 계정은 삭제할 수 없습니다.",
        )

    crud_follow.remove_follower(
        db,
        user_id=current_user.id,
        follower_id=user_id,
    )
    return None


@router.post("/users/{user_id}/block", response_model=BlockResponse, status_code=status.HTTP_201_CREATED)
def block_user(
    user_id: int,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_user_or_404(db, user_id)

    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="자기 자신은 차단할 수 없습니다.",
        )

    existing_block = crud_follow.get_block(
        db,
        blocker_id=current_user.id,
        blocked_id=user_id,
    )
    if existing_block:
        # Keep block idempotent and clean up any stale follow links.
        crud_follow.delete_follow_pair(db, current_user.id, user_id)
        response.status_code = status.HTTP_200_OK
        return existing_block

    try:
        return crud_follow.create_block(
            db,
            blocker_id=current_user.id,
            blocked_id=user_id,
        )
    except IntegrityError:
        db.rollback()
        existing_block = crud_follow.get_block(
            db,
            blocker_id=current_user.id,
            blocked_id=user_id,
        )
        if existing_block:
            response.status_code = status.HTTP_200_OK
            return existing_block
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="차단 처리에 실패했습니다.",
        )


@router.delete("/users/{user_id}/block", status_code=status.HTTP_204_NO_CONTENT)
def unblock_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_user_or_404(db, user_id)

    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="본인 계정은 차단 해제 대상이 아닙니다.",
        )

    crud_follow.delete_block(
        db,
        blocker_id=current_user.id,
        blocked_id=user_id,
    )
    return None


@router.get("/users/{user_id}/status", response_model=FollowStatusResponse)
def get_follow_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    _get_user_or_404(db, user_id)

    if not current_user or current_user.id == user_id:
        return FollowStatusResponse(user_id=user_id, is_following=False)

    is_following = crud_follow.is_following(
        db,
        follower_id=current_user.id,
        following_id=user_id,
    )
    return FollowStatusResponse(user_id=user_id, is_following=is_following)


@router.get("/users/{user_id}/followers", response_model=FollowUserListResponse)
def get_followers(
    user_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    _get_user_or_404(db, user_id)
    skip = (page - 1) * page_size
    rows, total = crud_follow.get_followers(db, user_id=user_id, skip=skip, limit=page_size)
    return _build_follow_user_list_response(rows, total=total, page=page, page_size=page_size)


@router.get("/users/{user_id}/following", response_model=FollowUserListResponse)
def get_following(
    user_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    _get_user_or_404(db, user_id)
    skip = (page - 1) * page_size
    rows, total = crud_follow.get_followings(db, user_id=user_id, skip=skip, limit=page_size)
    return _build_follow_user_list_response(rows, total=total, page=page, page_size=page_size)
