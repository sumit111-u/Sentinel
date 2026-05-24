"""
JWT session token utilities.
"""
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import Cookie, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from config import settings
from database import get_db

ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 7


def create_session_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=TOKEN_EXPIRE_DAYS)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    from models import User

    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )
    
    auth_header = request.headers.get("Authorization")
    prism_session = None
    if auth_header and auth_header.startswith("Bearer "):
        prism_session = auth_header.split(" ")[1]
    else:
        prism_session = request.cookies.get("prism_session")

    if not prism_session:
        raise credentials_exc

    try:
        payload = jwt.decode(prism_session, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise credentials_exc

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise credentials_exc
    return user
