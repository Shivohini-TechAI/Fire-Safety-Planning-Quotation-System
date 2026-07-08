from app.core.area_calculator import calculate_summary


def test_total_area_and_room_count(sample_floor_plan):
    summary = calculate_summary(sample_floor_plan)
    assert summary["num_rooms"] == 2
    assert summary["has_staircase"] is True
    assert summary["hallway_total_ft"] == 40
    assert summary["total_area_sqft"] == 385  # 300 + 80 + 5 (hallway has no area_sqft)


def test_area_by_floor_breakdown(sample_floor_plan):
    summary = calculate_summary(sample_floor_plan)
    assert summary["area_by_floor"][1] == 380  # room(300) + staircase(80) on floor 1
    assert summary["area_by_floor"][2] == 5    # room(5) on floor 2


def test_high_rise_flag_above_four_floors():
    summary = calculate_summary({"spaces": [], "total_floors": 6})
    assert summary["is_high_rise"] is True


def test_high_rise_flag_at_or_below_four_floors():
    summary = calculate_summary({"spaces": [], "total_floors": 3})
    assert summary["is_high_rise"] is False
