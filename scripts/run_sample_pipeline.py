"""
Quick manual test: run the full Member-6 pipeline on data/sample_input.json
without needing to start the FastAPI server.

Usage:
    python scripts/run_sample_pipeline.py
"""
import json
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.core.area_calculator import calculate_summary  # noqa: E402
from app.core.deduplicator import deduplicate  # noqa: E402
from app.core.response_builder import build_response  # noqa: E402
from app.core.rule_engine import run_rule_engine  # noqa: E402
from app.core.rule_loader import load_rules  # noqa: E402
from app.core.validator import validate_spaces  # noqa: E402
from app.models.schemas import FloorPlanInput  # noqa: E402
from config.settings import settings  # noqa: E402


def main():
    sample_path = Path(__file__).resolve().parent.parent / "data" / "sample_input.json"
    with open(sample_path) as f:
        raw = json.load(f)

    floor_plan = FloorPlanInput(**raw)
    rule_set = load_rules(settings.RULES_CONFIG_PATH)

    clean_spaces, review_flags = validate_spaces(floor_plan.model_dump())
    building_summary = calculate_summary({**floor_plan.model_dump(), "spaces": clean_spaces})
    raw_recs, skipped = run_rule_engine(clean_spaces, building_summary, rule_set.rules)
    equipment = deduplicate(raw_recs)

    response = build_response(
        client_id=floor_plan.client_id,
        building_type=floor_plan.building_type,
        standard=rule_set.standard,
        rules_configured=rule_set.is_configured,
        equipment=equipment,
        review_flags=review_flags,
        skipped_rules=skipped,
    )

    print("\n=== RULE SET STATUS ===")
    print(f"standard={rule_set.standard}  is_template={rule_set.is_template}  "
          f"rules_loaded={len(rule_set.rules)}")

    print("\n=== BUILDING SUMMARY ===")
    print(json.dumps(building_summary, indent=2))

    print("\n=== REVIEW FLAGS (false-detection handling) ===")
    print(json.dumps(review_flags, indent=2))

    print("\n=== FINAL RESPONSE (what Member 4 receives) ===")
    print(response.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
