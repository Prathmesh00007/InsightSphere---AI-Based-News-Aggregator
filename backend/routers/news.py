from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
from services.news_collector import NewsCollector
from services.news_processor import NewsProcessor
from models.news import NewsArticle, NewsResponse
from database.mongodb import get_database
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
news_collector = NewsCollector()
news_processor = NewsProcessor()

@router.get("/latest", response_model=List[NewsArticle])
async def get_latest_news(
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = None,
    source: Optional[str] = None
):
    """Get latest news articles with optional filtering"""
    try:
        logger.info(f"Fetching latest news (limit: {limit}, category: {category}, source: {source})")
        db = await get_database()
        query = {}
        if category:
            query["category"] = category
        if source:
            query["source"] = source

        # Add logging for query
        logger.info(f"Executing query: {query}")
        
        articles = await db.news.find(query).sort("published_at", -1).limit(limit).to_list(length=limit)
        
        # Log the number of articles found
        logger.info(f"Found {len(articles)} articles")
        
        if not articles:
            logger.warning("No articles found in database")
            # Trigger a news collection if no articles are found
            await news_collector.collect_news()
            # Try fetching again
            articles = await db.news.find(query).sort("published_at", -1).limit(limit).to_list(length=limit)
            logger.info(f"After collection: found {len(articles)} articles")
        
        return articles
    except Exception as e:
        logger.error(f"Error fetching latest news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search", response_model=List[NewsArticle])
async def search_news(
    query: str,
    limit: int = Query(50, ge=1, le=100),
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None
):
    """Search news articles by keyword"""
    try:
        logger.info(f"Searching news with query: {query}")
        db = await get_database()
        search_query = {
            "$text": {"$search": query}
        }
        if from_date or to_date:
            search_query["published_at"] = {}
            if from_date:
                search_query["published_at"]["$gte"] = from_date
            if to_date:
                search_query["published_at"]["$lte"] = to_date

        articles = await db.news.find(search_query).sort("published_at", -1).limit(limit).to_list(length=limit)
        logger.info(f"Found {len(articles)} articles matching search query")
        return articles
    except Exception as e:
        logger.error(f"Error searching news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sources")
async def get_news_sources():
    """Get list of available news sources"""
    try:
        logger.info("Fetching available news sources")
        sources = await news_collector.get_available_sources()
        logger.info(f"Found {len(sources)} sources")
        return sources
    except Exception as e:
        logger.error(f"Error fetching news sources: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_news_categories():
    """Get list of news categories"""
    try:
        logger.info("Fetching news categories")
        categories = await news_processor.get_categories()
        logger.info(f"Found {len(categories)} categories")
        return categories
    except Exception as e:
        logger.error(f"Error fetching news categories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 
    
@router.get("/category/{category}", response_model=List[NewsArticle])
async def get_news_by_category(
    category: str,
    limit: int = Query(10, ge=1, le=100)
):
    """Get news articles by category"""
    try:
        logger.info(f"Fetching news for category: {category}")
        articles = await news_collector.get_news_by_category(category)
        if articles and len(articles) > limit:
            articles = articles[:limit]
        logger.info(f"Found {len(articles)} articles in category '{category}'")
        return articles
    except Exception as e:
        logger.error(f"Error fetching news by category: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))