from typing import List, Tuple

from sqlalchemy import and_, desc, or_
from sqlalchemy.orm import Session

from app.models.user_block import UserBlock
from app.models.user import User
from app.models.user_follow import UserFollow


def get_follow(db: Session, follower_id: int, following_id: int) -> UserFollow | None:
    return (
        db.query(UserFollow)
        .filter(
            UserFollow.follower_id == follower_id,
            UserFollow.following_id == following_id,
        )
        .first()
    )


def create_follow(db: Session, follower_id: int, following_id: int) -> UserFollow:
    db_follow = UserFollow(follower_id=follower_id, following_id=following_id)
    db.add(db_follow)
    db.commit()
    db.refresh(db_follow)
    return db_follow


def delete_follow(db: Session, follower_id: int, following_id: int) -> bool:
    db_follow = get_follow(db, follower_id=follower_id, following_id=following_id)
    if not db_follow:
        return False

    db.delete(db_follow)
    db.commit()
    return True


def is_following(db: Session, follower_id: int, following_id: int) -> bool:
    return get_follow(db, follower_id=follower_id, following_id=following_id) is not None


def get_following_user_ids(db: Session, follower_id: int) -> List[int]:
    rows = (
        db.query(UserFollow.following_id)
        .filter(UserFollow.follower_id == follower_id)
        .all()
    )
    return [following_id for (following_id,) in rows]


def remove_follower(db: Session, user_id: int, follower_id: int) -> bool:
    db_follow = get_follow(db, follower_id=follower_id, following_id=user_id)
    if not db_follow:
        return False
    db.delete(db_follow)
    db.commit()
    return True


def delete_follow_pair(db: Session, user_a_id: int, user_b_id: int) -> int:
    deleted_count = (
        db.query(UserFollow)
        .filter(
            or_(
                and_(
                    UserFollow.follower_id == user_a_id,
                    UserFollow.following_id == user_b_id,
                ),
                and_(
                    UserFollow.follower_id == user_b_id,
                    UserFollow.following_id == user_a_id,
                ),
            )
        )
        .delete(synchronize_session=False)
    )
    db.commit()
    return int(deleted_count or 0)


def get_block(db: Session, blocker_id: int, blocked_id: int) -> UserBlock | None:
    return (
        db.query(UserBlock)
        .filter(
            UserBlock.blocker_id == blocker_id,
            UserBlock.blocked_id == blocked_id,
        )
        .first()
    )


def is_blocked_between(db: Session, user_a_id: int, user_b_id: int) -> bool:
    return (
        db.query(UserBlock)
        .filter(
            or_(
                and_(
                    UserBlock.blocker_id == user_a_id,
                    UserBlock.blocked_id == user_b_id,
                ),
                and_(
                    UserBlock.blocker_id == user_b_id,
                    UserBlock.blocked_id == user_a_id,
                ),
            )
        )
        .first()
        is not None
    )


def create_block(db: Session, blocker_id: int, blocked_id: int) -> UserBlock:
    # Blocking removes any follow relationship in both directions.
    (
        db.query(UserFollow)
        .filter(
            or_(
                and_(
                    UserFollow.follower_id == blocker_id,
                    UserFollow.following_id == blocked_id,
                ),
                and_(
                    UserFollow.follower_id == blocked_id,
                    UserFollow.following_id == blocker_id,
                ),
            )
        )
        .delete(synchronize_session=False)
    )
    db_block = UserBlock(blocker_id=blocker_id, blocked_id=blocked_id)
    db.add(db_block)
    db.commit()
    db.refresh(db_block)
    return db_block


def delete_block(db: Session, blocker_id: int, blocked_id: int) -> bool:
    db_block = get_block(db, blocker_id=blocker_id, blocked_id=blocked_id)
    if not db_block:
        return False
    db.delete(db_block)
    db.commit()
    return True


def get_blocked_users(
    db: Session,
    blocker_id: int,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[list[tuple[User, UserBlock]], int]:
    query = (
        db.query(User, UserBlock)
        .join(UserBlock, UserBlock.blocked_id == User.id)
        .filter(UserBlock.blocker_id == blocker_id)
    )
    total = query.count()
    rows = (
        query
        .order_by(desc(UserBlock.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return rows, total


def get_followers(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[list[tuple[User, UserFollow]], int]:
    query = (
        db.query(User, UserFollow)
        .join(UserFollow, UserFollow.follower_id == User.id)
        .filter(UserFollow.following_id == user_id)
    )
    total = query.count()
    rows = (
        query
        .order_by(desc(UserFollow.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return rows, total


def get_followings(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[list[tuple[User, UserFollow]], int]:
    query = (
        db.query(User, UserFollow)
        .join(UserFollow, UserFollow.following_id == User.id)
        .filter(UserFollow.follower_id == user_id)
    )
    total = query.count()
    rows = (
        query
        .order_by(desc(UserFollow.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return rows, total
