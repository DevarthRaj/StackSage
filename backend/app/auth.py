import os
from typing import Optional
import httpx
from jose import jwt, JWTError
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# This tells FastAPI to look for a Bearer token in the Authorization header
security = HTTPBearer()

# Cache the JWKS so we don't fetch it on every single request
# In production you'd want a proper cache with TTL, but this works for dev
_jwks_cache: Optional[dict] = None


async def get_jwks() -> dict:
    """
    Fetch Clerk's public JSON Web Key Set (JWKS).
    These are the public keys used to verify JWT signatures.
    We cache them to avoid hammering Clerk's servers.
    """
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    jwks_url = os.environ.get("CLERK_JWKS_URL")
    if not jwks_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="CLERK_JWKS_URL environment variable not set",
        )

    async with httpx.AsyncClient() as client:
        response = await client.get(jwks_url)
        response.raise_for_status()
        _jwks_cache = response.json()
        return _jwks_cache


async def verify_clerk_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> dict:
    """
    FastAPI dependency that verifies a Clerk JWT token.

    Usage in any endpoint:
        @router.get("/protected")
        async def protected_route(user: dict = Depends(verify_clerk_token)):
            return {"user_id": user["sub"]}

    Returns the decoded JWT payload (which contains user_id as "sub").
    Raises HTTP 401 if the token is missing, expired, or invalid.
    """
    token = credentials.credentials  # The raw JWT string

    try:
        # Fetch Clerk's public keys
        jwks = await get_jwks()

        # Decode and verify the JWT
        # python-jose automatically finds the right key from the JWKS
        # using the "kid" (key ID) in the token header
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],  # Clerk uses RSA SHA-256
            options={"verify_aud": False},  # Clerk tokens don't always have audience
        )

        return payload  # Contains: sub (user_id), email, name, exp, etc.

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )