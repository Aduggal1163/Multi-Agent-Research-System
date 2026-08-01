import os
import hmac
import hashlib
import json
import base64
import time
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.db import get_db
from database.crud import get_user_by_id

SECRET_KEY = os.getenv("JWT_SECRET", "insightflow-secret-auth-key-2026-hyper-secure")
security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """Hashes a password using PBKDF2 HMAC SHA-256 with a random 16-byte salt."""
    salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}${key.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """Verifies a plain password against a stored PBKDF2 hash."""
    try:
        salt, key_hex = hashed.split('$')
        key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return hmac.compare_digest(key.hex(), key_hex)
    except Exception:
        return False

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def create_jwt_token(payload: dict, expires_in: int = 86400) -> str:
    """Creates an HS256 signed JSON Web Token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload_copy = payload.copy()
    payload_copy["exp"] = int(time.time()) + expires_in
    
    header_encoded = base64url_encode(json.dumps(header).encode('utf-8'))
    payload_encoded = base64url_encode(json.dumps(payload_copy).encode('utf-8'))
    
    signature_input = f"{header_encoded}.{payload_encoded}".encode('utf-8')
    signature = hmac.new(SECRET_KEY.encode('utf-8'), signature_input, hashlib.sha256).digest()
    signature_encoded = base64url_encode(signature)
    
    return f"{header_encoded}.{payload_encoded}.{signature_encoded}"

def decode_jwt_token(token: str) -> dict:
    """Decodes and validates an HS256 signed JWT token."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_encoded, payload_encoded, signature_encoded = parts
        
        signature_input = f"{header_encoded}.{payload_encoded}".encode('utf-8')
        expected_signature = base64url_encode(hmac.new(SECRET_KEY.encode('utf-8'), signature_input, hashlib.sha256).digest())
        
        if not hmac.compare_digest(signature_encoded, expected_signature):
            return None
        
        payload = json.loads(base64url_decode(payload_encoded).decode('utf-8'))
        if payload.get("exp") and time.time() > payload["exp"]:
            return None
        return payload
    except Exception:
        return None

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """FastAPI dependency that extracts and validates the Bearer JWT token."""
    if not credentials:
        return None
    
    token = credentials.credentials
    payload = decode_jwt_token(token)
    if not payload or "sub" not in payload:
        return None
    
    user_id = payload["sub"]
    user = get_user_by_id(db, user_id=int(user_id))
    return user
