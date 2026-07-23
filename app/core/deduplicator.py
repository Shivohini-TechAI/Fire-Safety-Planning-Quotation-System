"""
Merges duplicate equipment recommendations (same item + same zone) into a
single line, and applies basic sanity rules — never recommend zero units,
keep the output sorted so reports render consistently.
"""


def deduplicate(raw_recommendations: list[dict]) -> list[dict]:
    grouped: dict[tuple[str, str], dict] = {}

    for rec in raw_recommendations:
        key = (rec["item"], rec["zone"])
        if key not in grouped:
            grouped[key] = {
                "item": rec["item"],
                "zone": rec["zone"],
                "qty": 0,
                "rule_refs": set(),
            }
        grouped[key]["qty"] += rec["qty"]
        grouped[key]["rule_refs"].add(rec.get("rule_ref", "UNKNOWN"))

    deduped = []
    for entry in grouped.values():
        deduped.append({
            "item": entry["item"],
            "qty": max(1, entry["qty"]),
            "zone": entry["zone"],
            "rule_refs": sorted(entry["rule_refs"]),
        })

    deduped.sort(key=lambda r: (r["zone"], r["item"]))
    return deduped
