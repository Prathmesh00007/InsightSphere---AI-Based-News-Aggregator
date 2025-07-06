from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from services.news_processor import NewsProcessor
from database.mongodb import get_database

router = APIRouter()
news_processor = NewsProcessor()

@router.get("/sentiment/trends")
async def get_sentiment_trends(
    category: Optional[str] = None,
    source: Optional[str] = None,
    days: int = Query(7, ge=1, le=30)
):
    """Get sentiment trends over time"""
    try:
        db = await get_database()
        query = {
            "published_at": {
                "$gte": datetime.now() - timedelta(days=days)
            }
        }
        if category:
            query["category"] = category
        if source:
            query["source"] = source

        articles = await db.news.find(query).to_list(length=None)
        
        # Calculate daily sentiment averages
        daily_sentiments = {}
        for article in articles:
            if "sentiment" in article:
                date = article["published_at"].date()
                if date not in daily_sentiments:
                    daily_sentiments[date] = {
                        "positive": 0,
                        "negative": 0,
                        "neutral": 0,
                        "count": 0
                    }
                daily_sentiments[date]["positive"] += article["sentiment"]["positive"]
                daily_sentiments[date]["negative"] += article["sentiment"]["negative"]
                daily_sentiments[date]["neutral"] += article["sentiment"]["neutral"]
                daily_sentiments[date]["count"] += 1

        # Calculate averages
        for date in daily_sentiments:
            count = daily_sentiments[date]["count"]
            daily_sentiments[date]["positive"] /= count
            daily_sentiments[date]["negative"] /= count
            daily_sentiments[date]["neutral"] /= count

        return {
            "trends": [
                {
                    "date": date.isoformat(),
                    "sentiment": {
                        "positive": data["positive"],
                        "negative": data["negative"],
                        "neutral": data["neutral"]
                    }
                }
                for date, data in sorted(daily_sentiments.items())
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/entities/top")
async def get_top_entities(
    category: Optional[str] = None,
    limit: int = Query(10, ge=1, le=50)
):
    """Get most frequently mentioned entities"""
    try:
        db = await get_database()
        query = {}
        if category:
            query["category"] = category

        articles = await db.news.find(query).to_list(length=None)
        
        # Count entity occurrences
        entity_counts = {}
        for article in articles:
            if "entities" in article:
                for entity in article["entities"]:
                    key = f"{entity['text']} ({entity['label']})"
                    if key not in entity_counts:
                        entity_counts[key] = 0
                    entity_counts[key] += 1

        # Sort and get top entities
        top_entities = sorted(
            [{"entity": k, "count": v} for k, v in entity_counts.items()],
            key=lambda x: x["count"],
            reverse=True
        )[:limit]

        return {"top_entities": top_entities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories/distribution")
async def get_category_distribution(
    days: int = Query(7, ge=1, le=30)
):
    """Get distribution of articles across categories"""
    try:
        db = await get_database()
        pipeline = [
            {
                "$match": {
                    "published_at": {
                        "$gte": datetime.now() - timedelta(days=days)
                    }
                }
            },
            {
                "$group": {
                    "_id": "$category",
                    "count": {"$sum": 1}
                }
            }
        ]

        results = await db.news.aggregate(pipeline).to_list(length=None)
        
        return {
            "distribution": [
                {"category": r["_id"], "count": r["count"]}
                for r in results
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sources/analysis")
async def get_source_analysis(
    days: int = Query(7, ge=1, le=30)
):
    """Get analysis of news sources"""
    try:
        db = await get_database()
        pipeline = [
            {
                "$match": {
                    "published_at": {
                        "$gte": datetime.now() - timedelta(days=days)
                    }
                }
            },
            {
                "$group": {
                    "_id": "$source",
                    "article_count": {"$sum": 1},
                    "avg_sentiment": {
                        "$avg": {
                            "$add": [
                                "$sentiment.positive",
                                {"$multiply": ["$sentiment.negative", -1]}
                            ]
                        }
                    }
                }
            }
        ]

        results = await db.news.aggregate(pipeline).to_list(length=None)
        
        return {
            "sources": [
                {
                    "source": r["_id"],
                    "article_count": r["article_count"],
                    "avg_sentiment": r["avg_sentiment"]
                }
                for r in results
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 