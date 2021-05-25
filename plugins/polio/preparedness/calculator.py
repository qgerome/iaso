from itertools import accumulate


def get_preparedness_score(data):
    get_status_score = lambda region: region.get("status_score", 0.0)

    national_score = data.get("national", {}).get("status_score", 0.0)

    regions = data.get("regions", {}).values()
    regional_score = sum(map(get_status_score, regions)) / max(len(regions), 1)

    districts = data.get("districts", {}).values()
    district_score = sum(map(get_status_score, districts)) / max(len(districts), 1)

    return {
        "national_score": national_score,
        "regional_score": regional_score,
        "district_score": district_score,
    }
