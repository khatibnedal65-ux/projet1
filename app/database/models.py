from datetime import datetime
from pathlib import Path

from sqlalchemy import Column, DateTime, Float, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = Path(__file__).resolve().parent.parent.parent / "solar_deals.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    url_hash = Column(String(64), unique=True, index=True, nullable=False)
    country = Column(String(64), index=True, nullable=False)
    source_website = Column(String(256), nullable=False)
    listing_url = Column(String(1024), nullable=False)
    title = Column(String(512), nullable=False)
    price_eur = Column(Float, nullable=True)
    quantity = Column(Integer, nullable=True, default=1)
    watt_per_panel = Column(Integer, nullable=True)
    eur_per_watt = Column(Float, nullable=True, index=True)
    classification = Column(String(32), nullable=True, index=True)
    condition = Column(String(64), nullable=True)
    previous_price_eur = Column(Float, nullable=True)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
