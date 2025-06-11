# Insight Sphere Backend

An AI-powered news aggregator that fetches and analyzes news from multiple sources in real-time.

## Features

- Real-time news aggregation from multiple sources (NewsAPI, RSS feeds)
- AI-powered text analysis including:
  - Entity extraction
  - Sentiment analysis
  - Topic categorization
- RESTful API endpoints for news retrieval and analysis
- MongoDB database for storing news articles and analysis results
- Asynchronous processing for better performance

## Prerequisites

- Python 3.8+
- MongoDB
- Redis (optional, for caching)
- NewsAPI account (free tier available)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download required NLTK data:
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger'); nltk.download('wordnet')"
```

5. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

6. Create a `.env` file based on `.env.example` and fill in your configuration:
```bash
cp .env.example .env
```

7. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
```

## Running the Application

1. Start the FastAPI server:
```bash
uvicorn app:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Main Endpoints

- `GET /api/news/latest` - Get latest news articles
- `GET /api/news/search` - Search news articles
- `GET /api/news/sources` - Get available news sources
- `GET /api/news/categories` - Get news categories

## Development

The project structure is organized as follows:

```
backend/
├── app.py              # Main FastAPI application
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
├── models/            # Pydantic models
├── services/          # Business logic
├── database/          # Database configuration
└── routers/           # API endpoints
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 