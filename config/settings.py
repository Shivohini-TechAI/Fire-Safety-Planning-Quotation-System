"""
Centralised configuration for the Rule Engine service.

Reads from environment variables (with sane defaults) so the exact same
code works locally, in Docker, and in production without any code changes
— only the .env file differs between environments.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings:
    PORT: int = int(os.getenv("PORT", 8002))
    ENV: str = os.getenv("ENV", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    RULES_CONFIG_PATH: Path = BASE_DIR / os.getenv(
        "RULES_CONFIG_PATH", "config/rules_template.json"
    )

    ALLOWED_ORIGIN: str = os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")

    # Thresholds used by the false-detection validator (app/core/validator.py)
    MIN_VALID_AREA_SQFT: float = float(os.getenv("MIN_VALID_AREA_SQFT", 10))
    MAX_AREA_OVERSHOOT_RATIO: float = float(os.getenv("MAX_AREA_OVERSHOOT_RATIO", 2.0))
    MIN_CONFIDENCE: float = float(os.getenv("MIN_CONFIDENCE", 0.5))


settings = Settings()
