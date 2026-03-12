from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from functools import lru_cache
import requests
from core.config import SUPABASE_JWKS_URL

security = HTTPBearer()

@lru_cache(maxsize=1)
def get_jwks():
    return requests.get(SUPABASE_JWKS_URL).json()

def get_current_user(credentials=Depends(security)):
    token = credentials.credentials
    try:
        header = jwt.get_unverified_header(token)

        kid = header["kid"]

        key = None
        for k in get_jwks()["keys"]:
            if k["kid"] == kid:
                key = k

        if key is None:
            raise HTTPException(status_code=401, detail="Invalid token key")
        
        payload = jwt.decode(
            token,
            key,
            algorithms=["ES256"],
            options={"verify_aud": False}
        )

        user_id = payload["sub"]

        return user_id
    except JWTError as e:
        print(f"JWT decode error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in token validation: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=401, detail="Token validation failed")