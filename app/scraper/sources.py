"""Search queries per European country / language."""
COUNTRY_QUERIES: dict[str, list[str]] = {
    "Germany": [
        "Solarmodule gebraucht kaufen Palette",
        "PV Module Restposten Großhandel",
        "Solarpanele Sonderposten verkauf",
    ],
    "France": [
        "panneaux solaires occasion vente palette",
        "modules photovoltaïques destockage",
        "panneaux solaires neufs gros",
    ],
    "Italy": [
        "pannelli solari usati vendita pallet",
        "moduli fotovoltaici stock liquidazione",
    ],
    "Spain": [
        "paneles solares usados venta palet",
        "módulos fotovoltaicos stock liquidación",
    ],
    "Portugal": [
        "painéis solares usados venda palete",
        "módulos fotovoltaicos stock",
    ],
    "Netherlands": [
        "zonnepanelen tweedehands verkoop pallet",
        "PV panelen restpartij groothandel",
    ],
    "Belgium": [
        "zonnepanelen tweedehands België",
        "panneaux solaires occasion Belgique",
    ],
    "Switzerland": [
        "Solarmodule gebraucht Schweiz Palette",
        "panneaux solaires occasion Suisse",
    ],
    "Sweden": [
        "solpaneler begagnade försäljning pall",
        "solceller restparti grossist",
    ],
    "Norway": [
        "solcellepaneler brukt salg pall",
    ],
    "Denmark": [
        "solceller brugt salg palle",
    ],
}

# Hard exclusion list (Facebook entirely, plus a few obvious non-marketplaces).
EXCLUDED_DOMAINS = (
    "facebook.com",
    "fb.com",
    "fb.me",
    "messenger.com",
    "instagram.com",
)
