# mongodb.py
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import logging
import asyncio
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MongoDB connection settings
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "insightsphere")

# Global variables for database connection
client = None
db = None

async def connect_to_mongodb():
    """
    Connect to MongoDB, verify the connection, and create necessary indexes.
    """
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        # Verify the connection by issuing a ping command.
        await db.command("ping")
        logger.info("Connected to MongoDB successfully")
        
        # Create indexes after establishing the connection.
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongodb_connection():
    """
    Close MongoDB connection.
    """
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed")

async def get_database():
    """
    Ensure the database connection is established. Returns the connected database.
    """
    global db
    if db is None:
        await connect_to_mongodb()
    return db

async def create_indexes():
    """
    Create necessary indexes for collections using an initialized database instance.
    Note: This function retrieves the database via get_database() to ensure that a valid
    connection is available.
    """
    database = await get_database()  # Guarantees that the database has been initialized.
    try:
        await database.users.create_index("username", unique=True)
        await database.users.create_index("email", unique=True)
        
        await database.news.create_index("url", unique=True)
        await database.news.create_index("published_at")
        await database.news.create_index("category")
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")
        raise 

# Example initialization entry point.
# This block will run when you execute `python mongodb.py` directly.
async def main():
    await connect_to_mongodb()
    logger.info("MongoDB setup is complete.")
    # If needed, you can perform additional operations here.
    # Optionally, close the connection once done:
    # await close_mongodb_connection()

if __name__ == "__main__":
    asyncio.run(main())
