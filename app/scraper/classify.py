def classify_eur_per_watt(eur_per_watt: float | None) -> str | None:
    if eur_per_watt is None or eur_per_watt <= 0:
        return None
    if eur_per_watt < 0.05:
        return "excellent_plus"
    if eur_per_watt < 0.07:
        return "excellent"
    if eur_per_watt < 0.10:
        return "good"
    if eur_per_watt < 0.13:
        return "average"
    return "expensive"
