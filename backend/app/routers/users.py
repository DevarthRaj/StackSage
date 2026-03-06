from fastapi import APIRouter, Depends
from app.services.auth import verify_clerk_token

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/me")
async def get_current_user(
    user: dict = Depends(verify_clerk_token)
):
    """
    Returns the current authenticated user's basic info.
    The 'Depends(verify_clerk_token)' part is where the magic happens:
    - FastAPI calls verify_clerk_token before this function runs
    - If the token is invalid, FastAPI returns 401 automatically
    - If valid, the decoded token payload is passed as 'user'
    """
    return {
        "user_id": user.get("sub"),       # Clerk's unique user ID
        "email": user.get("email"),        # User's email
        "name": user.get("name"),          # User's full name
    }