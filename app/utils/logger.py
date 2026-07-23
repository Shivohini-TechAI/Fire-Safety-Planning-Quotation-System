"""
Persists review flags (false-detection warnings, compliance gaps, etc.)
to a local JSON-lines log file so the team can review them later — kept
separate from the API response itself so the client never sees internal
QA notes, but the team never loses track of them either.
"""
import json
from datetime import datetime, timezone
from pathlib import Path

LOG_DIR = Path(__file__).resolve().parent.parent.parent / "logs"
LOG_FILE = LOG_DIR / "review_flags.log"


def log_review_flags(client_id: str, floor_plan_id: str, flags: list[dict]) -> None:
    if not flags:
        return

    LOG_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now(timezone.utc).isoformat()

    with open(LOG_FILE, "a", encoding="utf-8") as f:
        for flag in flags:
            f.write(json.dumps({
                "timestamp": timestamp,
                "client_id": client_id,
                "floor_plan_id": floor_plan_id,
                **flag,
            }) + "\n")
