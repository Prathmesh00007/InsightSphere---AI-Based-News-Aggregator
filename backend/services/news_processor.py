import spacy
import nltk
from typing import List, Dict, Any
from datetime import datetime
from database.mongodb import get_database
import asyncio
import logging
# Download required NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NewsProcessor:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.categories = [
            "politics", "technology", "business", "sports",
            "entertainment", "health", "science", "world"
        ]

    async def get_categories(self) -> List[str]:
        """Get list of available news categories"""
        return self.categories

    def extract_entities(self, text: str) -> List[Dict[str, str]]:
        """Extract named entities from text"""
        doc = self.nlp(text)
        entities = []
        for ent in doc.ents:
            entities.append({
                "text": ent.text,
                "label": ent.label_,
                "start": ent.start_char,
                "end": ent.end_char
            })
        return entities

    def categorize_article(self, title: str, description: str) -> str:
        """Categorize article based on its content"""
        # Combine title and description for better categorization
        text = f"{title} {description}".lower()
        
        # Simple keyword-based categorization
        category_keywords = {
            "politics": ["politics", "government", "election", "president", "congress"],
            "technology": ["technology", "tech", "software", "digital", "computer"],
            "business": ["business", "economy", "market", "stock", "finance"],
            "sports": ["sports", "game", "team", "player", "championship"],
            "entertainment": ["entertainment", "movie", "music", "celebrity", "show"],
            "health": ["health", "medical", "disease", "hospital", "doctor"],
            "science": ["science", "research", "study", "scientist", "discovery"],
            "world": ["world", "international", "global", "foreign", "country"]
        }

        # Count keyword matches for each category
        category_scores = {category: 0 for category in self.categories}
        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    category_scores[category] += 1

        # Return category with highest score, default to "world" if no matches
        max_category = max(category_scores.items(), key=lambda x: x[1])
        return max_category[0] if max_category[1] > 0 else "world"

    def analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Perform basic sentiment analysis"""
        doc = self.nlp(text)
        
        # Simple sentiment analysis based on positive/negative word lists
        positive_words = {"good", "great", "excellent", "positive", "success", "win"}
        negative_words = {"bad", "terrible", "negative", "failure", "loss", "problem"}
        
        positive_count = sum(1 for token in doc if token.text.lower() in positive_words)
        negative_count = sum(1 for token in doc if token.text.lower() in negative_words)
        total_count = positive_count + negative_count
        
        if total_count == 0:
            return {"positive": 0.5, "negative": 0.5, "neutral": 1.0}
        
        positive_score = positive_count / total_count
        negative_score = negative_count / total_count
        neutral_score = 1 - (positive_score + negative_score)
        
        return {
            "positive": positive_score,
            "negative": negative_score,
            "neutral": neutral_score
        }

    async def process_article(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single article with all analysis methods"""
        # Combine title and description for analysis
        text = f"{article['title']} {article.get('description', '')}"
        
        # Perform analysis
        entities = self.extract_entities(text)
        category = self.categorize_article(article['title'], article.get('description', ''))
        sentiment = self.analyze_sentiment(text)
        
        # Update article with analysis results
        article.update({
            "entities": entities,
            "category": category,
            "sentiment": sentiment,
            "processed_at": datetime.now()
        })
        
        return article

    async def process_all_articles(self):
        """Process all unprocessed articles in the database"""
        db = await get_database()
        unprocessed = await db.news.find({"processed_at": None}).to_list(length=None)
        logger.info(f"Found {len(unprocessed)} unprocessed articles.")
        for article in unprocessed:
            try:
                processed_article = await self.process_article(article)
                await db.news.update_one(
                    {"_id": article["_id"]},
                    {"$set": {
                        "entities": processed_article["entities"],
                        "category": processed_article["category"],
                        "sentiment": processed_article["sentiment"],
                        "processed_at": processed_article["processed_at"]
                    }}
                )
                logger.info(f"Processed article: {article.get('title', 'Unknown')}")
            except Exception as e:
                logger.error(f"Error processing article {article.get('title', 'Unknown')}: {e}")


    async def start_processing_loop(self, interval: int = 300):
        logger.info("News processing loop started successfully.")
        while True:
            try:
                await self.process_all_articles()
            except Exception as e:
                logger.error(f"Error in processing loop: {e}")
            await asyncio.sleep(interval)

    

