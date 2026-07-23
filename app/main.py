"""
FastAPI entrypoint for the Rule Engine service (Member 6).

Run with:
    uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from config.settings import settings

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

app = FastAPI(
    title="Fire Safety Rule Engine",
    description=(
        "Converts detected floor-plan spaces into equipment recommendations. "
        "Rule values are pending confirmation of the client's region/fire code "
        "— see README.md."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGIN],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
