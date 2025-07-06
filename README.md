# 🎯 InsightSphere  
**AI-Based News Aggregator**  

InsightSphere is a full-stack web application that continuously pulls, processes, and surfaces the day’s top stories—enhanced by AI-powered summarization, classification, translation, and voice-driven navigation. Built for anyone who wants to stay on top of global events in less time and with more context.

---

## 📋 Table of Contents  
1. [Key Features](#key-features)  
2. [Tech Stack & Architecture](#tech-stack--architecture)  
3. [Repository Structure](#repository-structure)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Configuration](#configuration)  
   - [Running Locally](#running-locally)  
5. [Usage & Screenshots](#usage--screenshots)  
6. [API Reference](#api-reference)  
7. [Contributing](#contributing)  
8. [License & Contact](#license--contact)  

---

## 🔑 Key Features  
- **Multi-Source Aggregation**  
  Fetch articles from RSS/XML feeds (Google News, BBC, Hacker News, etc.) in real time.  
- **AI Summarization**  
  Use transformer-based extractive summarizers to present concise bullet-point overviews.  
- **Article Classification**  
  Automatically tag articles by category (Tech, Business, Sports, Health, …) via an NLP classifier.  
- **Live Translation**  
  Translate headlines and summaries on-the-fly (e.g. English ↔ Hindi/Gujarati) leveraging AWS Translate or open-source models.  
- **Voice Assistant**  
  Navigate and consume news hands-free using a built-in voice command interface.  
- **User Preferences & History**  
  Persist user settings, saved articles, and reading history in a lightweight database.  

---

## 🏗 Tech Stack & Architecture  

| Layer              | Technology                         |
| ------------------ | ---------------------------------- |
| Frontend           | React.js, HTML5, CSS3, TailwindCSS |
| Backend API        | Python (FastAPI) or Node.js (Express) |
| AI / NLP Services  | Hugging Face Transformers, spaCy, AWS Translate |
| Data Storage       | SQLite / MongoDB                   |
| DevOps & CI/CD     | Docker, GitHub Actions, Netlify/Heroku |

**Architecture Flow**  
1. **Crawler Service** scrapes configured RSS feeds every X minutes.  
2. **Processing Pipeline** runs summarization, classification, translation.  
3. **API Layer** exposes REST endpoints for all frontend needs.  
4. **Web Client** displays article lists, summaries, and voice controls.  

---

## 📂 Repository Structure  
InsightSphere/ 

├── backend/ # REST API + AI pipeline 

│ ├── app/ # FastAPI routes, controllers 

│ ├── models/ # Pydantic / DB schemas 

│ ├── services/ # Scraper, summarizer, translator modules 

│ └── requirements.txt 

│── frontend/ # React application 

│ ├── public/ # Static assets (index.html, favicon) 

│ ├── src/ # Components, pages, hooks, styles 

│ └── package.json 

│ ├── InsightSphere_New/ # Internal prototypes or legacy code 

├── .vscode/ # Editor configuration 

└── README.md # ← you are here


---

## 🚀 Getting Started  

### Prerequisites  
- Node.js ≥ v14 & npm (or Yarn)  
- Python ≥ v3.8 & pip  
- (Optional) AWS account for Translate API  
- Docker (for containerized runs)  

### Installation  

1. **Clone the repository**  
    ```bash
    git clone https://github.com/Prathmesh00007/InsightSphere---AI-Based-News-Aggregator.git
    cd InsightSphere---AI-Based-News-Aggregator
    ```

2. **Install & bootstrap backend**  
    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate      # Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    ```

3. **Install & bootstrap frontend**  
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration  

Create a `.env` in `backend/`:
```dotenv
# Server  
BACKEND_HOST=0.0.0.0  
BACKEND_PORT=8000
```


Running Locally
Start the backend server

```bash
cd backend
uvicorn app.main:app --reload
Start the React frontend
```

```bash
cd frontend
npm run start
Open http://localhost:3000 in your browser.
```


Home – sees latest aggregated headlines.

Summaries – click an article to view AI-generated bullet points.

Translate – switch language with one click.

Voice Commands – say “next article” or “summarize this.”

## API Reference

Base URL: http://localhost:8000/api

Endpoint	Method	Description

/articles	GET	List all aggregated articles

/articles/{id}	GET	Get full article, summary, and translations

/articles/{id}/summary	POST	Regenerate summary (supports query params)

/preferences	GET/PUT	Get or update user preference object

## Contributing
Fork the repo

Create a new branch: git checkout -b feature/YourFeature

Commit your changes: git commit -m "Add awesome feature"

Push to GitHub: git push origin feature/YourFeature

Open a Pull Request
