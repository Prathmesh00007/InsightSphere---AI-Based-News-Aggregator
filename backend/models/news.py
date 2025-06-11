from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Optional
from datetime import datetime

class Entity(BaseModel):
    text: str
    label: str
    start: int
    end: int

class Sentiment(BaseModel):
    positive: float
    negative: float
    neutral: float

class NewsArticle(BaseModel):
    title: str
    description: str
    url: str
    published_at: datetime
    source: str
    content: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    entities: Optional[List[Entity]] = None
    sentiment: Optional[Sentiment] = None
    processed_at: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class NewsResponse(BaseModel):
    articles: List[NewsArticle]
    total: int
    page: int
    page_size: int 