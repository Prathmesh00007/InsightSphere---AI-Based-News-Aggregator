import os
import asyncio
import aiohttp
import feedparser
from datetime import datetime
from typing import List, Dict, Any
from newsapi import NewsApiClient
from database.mongodb import get_database
from models.news import NewsArticle
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NewsCollector:
    def __init__(self):
        self.newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))
        self.rss_feeds = [
            # Global News Sources
            "http://rss.cnn.com/rss/edition.rss",
            "https://www.theguardian.com/world/rss",
            "https://www.bbc.com/news/world/rss.xml",
            "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
            "http://feeds.reuters.com/Reuters/worldNews",
            "https://www.aljazeera.com/xml/rss/all.xml",
            "http://www.ap.org/rss/?page=5",  # Associated Press

            # Indian News Sources
            "https://timesofindia.indiatimes.com/rss.cms",  # Times of India
            "https://feeds.feedburner.com/NDTVindia",         # NDTV
            "https://indianexpress.com/feed/",               # The Indian Express
            "https://www.indiatoday.in/rss/1206578",          # India Today
            "https://www.thehindu.com/news/national/feeder/default.rss",  # The Hindu
            "https://economictimes.indiatimes.com/rssfeedsdefault.cms",   # Economic Times
            "https://www.hindustantimes.com/rss"              # Hindustan Times
        ]

        self.reddit_client = None  # Initialize if needed

    async def get_available_sources(self) -> List[str]:
        """Get list of available news sources"""
        sources = []
        # Add NewsAPI sources
        sources.extend([source['id'] for source in self.newsapi.get_sources()['sources']])
        # Add RSS feed sources
        sources.extend([feed.split('/')[2] for feed in self.rss_feeds])
        return list(set(sources))

    async def fetch_newsapi_articles(self) -> List[Dict[str, Any]]:
        """Fetch articles from NewsAPI"""
        try:
            logger.info("Fetching articles from NewsAPI...")
            response = self.newsapi.get_top_headlines(
                language='en',
                page_size=100
            )
            articles = response['articles']
            logger.info(f"Fetched {len(articles)} articles from NewsAPI")
            return articles
        except Exception as e:
            logger.error(f"Error fetching from NewsAPI: {e}")
            return []

    async def fetch_rss_articles(self) -> List[Dict[str, Any]]:
        """Fetch articles from RSS feeds"""
        import re
        articles = []
        async with aiohttp.ClientSession() as session:
            for feed_url in self.rss_feeds:
                try:
                    logger.info(f"Fetching RSS feed: {feed_url}")
                    async with session.get(feed_url) as response:
                        if response.status == 200:
                            content = await response.text()
                            feed = feedparser.parse(content)
                            feed_articles = []
                            for entry in feed.entries:
                                # Attempt to extract image URL from various fields
                                image_url = None
                                if 'media_content' in entry and entry.media_content:
                                    image_url = entry.media_content[0].get('url')
                                elif 'media_thumbnail' in entry and entry.media_thumbnail:
                                    image_url = entry.media_thumbnail[0].get('url')
                                elif 'enclosures' in entry and entry.enclosures:
                                    image_url = entry.enclosures[0].get('href')
                                else:
                                    # Fallback: try to extract from the description using regex.
                                    desc = getattr(entry, 'description', '')
                                    match = re.search(r'<img\s+[^>]*src=[\'"]([^\'"]+)[\'"]', desc)
                                    if match:
                                        image_url = match.group(1)

                                feed_articles.append({
                                    'title': entry.title,
                                    'description': getattr(entry, 'description', ''),
                                    'url': entry.link,
                                    'published_at': datetime(*entry.published_parsed[:6]) if hasattr(entry, 'published_parsed') else datetime.now(),
                                    'source': feed_url.split('/')[2],
                                    'image_url': image_url  # now set, if found
                                })
                            articles.extend(feed_articles)
                            logger.info(f"Fetched {len(feed_articles)} articles from {feed_url}")
                except Exception as e:
                    logger.error(f"Error fetching RSS feed {feed_url}: {e}")
        return articles



    async def process_and_store_articles(self, articles: List[Dict[str, Any]]):
        """Process and store articles in the database"""
        db = await get_database()
        stored_count = 0
        for article in articles:
            try:     
                    # Create NewsArticle object
                    news_article = NewsArticle(
                        title=article['title'],
                        description=article.get('description', ''),
                        url=article['url'],
                        published_at=article.get('published_at', datetime.now()),
                        source=article.get('source', 'unknown'),
                        content=article.get('content', ''),
                        author=article.get('author', ''),
                        image_url=article.get('urlToImage', '')
                    )
                    # Store in database
                    await db.news.update_one(
                        {"url": article["url"]},
                        {"$setOnInsert": news_article.dict()},
                        upsert=True
                    )
              
                    stored_count += 1
            except Exception as e:
                logger.error(f"Error processing article: {e}")
        logger.info(f"Stored {stored_count} new articles in database")

    async def collect_news(self):
        """Main method to collect news from all sources"""
        logger.info("Starting news collection...")
        # Fetch from NewsAPI
        newsapi_articles = await self.fetch_newsapi_articles()
        # Fetch from RSS feeds
        rss_articles = await self.fetch_rss_articles()
        # Combine and process all articles
        all_articles = newsapi_articles + rss_articles
        logger.info(f"Total articles collected: {len(all_articles)}")
        await self.process_and_store_articles(all_articles)

    async def start_collection_scheduler(self):
        """Start the news collection scheduler"""
        logger.info("Starting news collection scheduler...")
        while True:
            await self.collect_news()
            # Wait for 15 minutes before next collection
            logger.info("Waiting 15 minutes before next collection...")
            await asyncio.sleep(900)  # 15 minutes 

    async def get_news_by_category(self, category: str) -> List[Dict[str, Any]]:
        """
        Fetch stored articles from the database that match the given category.

        You can perform a case-insensitive search by using a regular expression if needed.
        """
        db = await get_database()
        # Using a case-insensitive regular expression for matching the category.
        cursor = db.news.find({"category": {"$regex": f"^{category}$", "$options": "i"}})
        articles = await cursor.to_list(length=None)
        logger.info(f"Found {len(articles)} articles in category '{category}'")
        return articles