from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn
import asyncio
from services.news_collector import NewsCollector
from services.news_processor import NewsProcessor
from database.mongodb import create_indexes
import logging
# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Insight Sphere API", description="AI-powered news aggregator API")

origins = [
    "https://insight-sphere.netlify.app",
    # Add more origins if needed.
]
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from routers import news, analysis, auth

# Include routers
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

@app.on_event("startup")
async def startup_event():
    await create_indexes()
    
    news_collector = NewsCollector()
    app.state.news_collector_task = asyncio.create_task(news_collector.start_collection_scheduler())
    asyncio.create_task(news_collector.collect_news())
    
    news_processor = NewsProcessor()
    logger.info("Launching news processor loop...")
    app.state.news_processor_task = asyncio.create_task(news_processor.start_processing_loop(interval=300))


@app.get("/")
async def root():
    return {"message": "Welcome to Insight Sphere API"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
