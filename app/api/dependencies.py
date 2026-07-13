"""
Simple shared-secret authentication for service-to-service calls.

This is NOT user login/auth (that's Member 3's JWT system for people using
the app). This protects your FastAPI service itself from being called by
anyone who isn't your team's backend — especially important once this
server is reachable via ngrok or a real deployment, where the URL is no
longer just "on your laptop."
"""
from fastapi import Header, HTTPException

from config.settings import settings


async def verify_api_key(x_api_key: str = Header(default=None)):
    if not settings.API_KEY:
        # No key configured -> auth disabled (local solo dev only).
        return

    if x_api_key != settings.API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid X-API-Key header.",
        )