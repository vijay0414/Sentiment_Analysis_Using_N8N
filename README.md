# Sentiment Analysis Using N8N

A powerful web application that analyzes sentiment from Google Maps reviews using N8N workflow automation. This project extracts reviews from Google Maps locations, aggregates them, and provides sentiment analysis capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [N8N Workflow](#n8n-workflow)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application combines the power of N8N workflow automation with a web-based frontend to analyze sentiment from Google Maps reviews. It automatically fetches reviews for specific locations and processes them through an N8N workflow for sentiment analysis.

## Features

- ✅ **Google Maps Integration**: Extracts place information and reviews from Google Maps
- ✅ **N8N Automation**: Automated workflow for review collection and processing
- ✅ **Web Interface**: Clean, responsive UI for submitting URLs
- ✅ **Review Management**: Store and manage collected reviews in memory
- ✅ **SerpAPI Integration**: Uses SerpAPI for accessing Google Maps data
- ✅ **Real-time Webhook Processing**: Receives and processes webhook data from N8N
- ✅ **RESTful API**: Easy-to-use endpoints for managing reviews
- ✅ **Express Backend**: Lightweight Node.js server for serving and managing requests

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (index.html)               │
│              User Interface for URL Submission            │
└──────────────────┬──────────────────────────────────────┘
                   │ POST (Google Maps URL And Amazon Product URL)
                   ▼
┌─────────────────────────────────────────────────────────┐
│                   N8N Workflow                           │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │   Webhook    │───▶│  If (Check   │                  │
│  │   Receiver   │    │   google.com)│                  │
│  └──────────────┘    └──────┬───────┘                  │
│                             │                           │
│  ┌──────────────┐    ┌──────▼───────┐                  │
│  │  Place Name  │◀───│   Extract    │                  │
│  │  Extractor   │    │   Place Name │                  │
│  └──────┬───────┘    └──────────────┘                  │
│         │                                               │
│  ┌──────▼───────────────────────────────────┐          │
│  │  SerpAPI - Get Place Information & Reviews│          │
│  │  - google_maps engine                     │          │
│  │  - google_maps_reviews engine             │          │
│  └──────┬──────────────────────────────────┘          │
│         │                                               │
│  ┌──────▼───────────────────────────────────┐          │
│  │   Process & Return Reviews                │          │
│  │   (Sentiment Analysis Ready)              │          │
│  └──────────────────────────────────────────┘          │
└─────────────────┬──────────────────────────────────────┘
                  │ POST (Reviews & Data)
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Express Backend (server.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ /webhook     │  │ /reviews     │  │ /clear-reviews│ │
│  │ (Receive)    │  │ (Retrieve)   │  │ (Reset)      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                 Reviews Storage (In-Memory Array)       │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher) - [Download](https://nodejs.org/)
- **N8N** (version 0.x or higher) - [Installation Guide](https://docs.n8n.io/hosting/installation/)
- **SerpAPI Key** - [Get API Key](https://serpapi.com/)
- A **Google Maps URL** from a location (e.g., https://www.google.com/maps/place/...)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/Sentiment_Analysis_Using_N8N.git
cd Sentiment_Analysis_Using_N8N
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Configuration

### 1. **SerpAPI Configuration**

1. Sign up for a free SerpAPI account at [serpapi.com](https://serpapi.com/)
2. Copy your API key from the dashboard
3. In the N8N workflow (Sentiment Analysis.json):
   - Locate the HTTP Request nodes that call SerpAPI
   - Replace `API_KEY` with your actual SerpAPI key

### 2. **N8N Webhook Setup**

1. Open your N8N instance
2. Create a new workflow (or import the provided `Sentiment Analysis.json`)
3. Import the `Sentiment Analysis.json` file:
   - Go to **Workflows** → **Import from File**
   - Select `Sentiment Analysis.json`
4. Deploy the workflow
5. Copy the webhook URL from the Webhook trigger node
6. Update the `index.html` file with your webhook URL:
   ```javascript
   const webhookUrl = 'https://your-n8n-instance.com/webhook/sentiment-analysis';
   ```

### 3. **Local Testing**

For testing without a deployed N8N instance:
- Use [ngrok](https://ngrok.com/) to expose your local server:
  ```bash
  ngrok http 3000
  ```
- Use the ngrok URL as your N8N webhook endpoint

## Usage

### Via Web Interface

1. Open `http://localhost:3000` in your browser
2. Enter a Google Maps location URL (e.g., https://www.google.com/maps/place/Statue+of+Liberty/...)
3. Click **Submit**
4. The N8N workflow will:
   - Extract the location name
   - Fetch place information from Google Maps
   - Retrieve reviews for the location
   - Send the reviews to your backend
5. View collected reviews in the application

### Via API

#### Submit a URL to N8N Workflow

```bash
curl -X POST https://your-n8n-instance.com/webhook/sentiment-analysis \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com/maps/place/..."}'
```

#### Receive Reviews

```bash
curl http://localhost:3000/reviews
```

Response:
```json
{
  "reviews": [
    "Great place to visit!",
    "Amazing experience...",
    "Highly recommended..."
  ]
}
```

#### Clear Reviews

```bash
curl -X POST http://localhost:3000/clear-reviews
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/webhook` | Receives review data from N8N workflow |
| `GET` | `/reviews` | Retrieves all stored reviews |
| `POST` | `/clear-reviews` | Clears all stored reviews |
| `GET` | `/` | Serves the frontend (index.html) |

### Webhook Payload Format

```json
{
  "review": "Review text here",
  "place_id": "place_id_from_google",
  "rating": 4.5,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## N8N Workflow

### Workflow Components

The `Sentiment Analysis.json` workflow includes:

1. **Webhook Trigger**: Receives incoming URLs
2. **If Condition**: Validates that URL contains "google.com/maps"
3. **Place Name Extractor**: Uses regex to extract location name from URL
4. **Google Maps API Call**: Fetches place information using SerpAPI
5. **Reviews Fetcher**: Retrieves reviews for the place
6. **Data Processor**: Processes and formats the data
7. **Webhook Response**: Sends collected data to backend

### How It Works

1. User submits a Google Maps URL via the frontend
2. N8N webhook receives the URL
3. Workflow validates and extracts the place name
4. SerpAPI is called to fetch:
   - Place details (ratings, address, opening hours, etc.)
   - Reviews (sentiment data)
5. Reviews are processed and sent back to the Express backend
6. Backend stores reviews for analysis

## File Structure

```
Sentiment_Analysis_Using_N8N/
├── index.html                 # Frontend UI
├── server.js                  # Express backend server
├── package.json               # Node.js dependencies
├── Sentiment Analysis.json    # N8N workflow configuration
└── README.md                  # Project documentation
```

## Future Enhancements

- [ ] Implement actual sentiment analysis (using libraries like sentiment.js)
- [ ] Database integration (MongoDB, PostgreSQL) for persistent storage
- [ ] Advanced filtering and search capabilities
- [ ] Sentiment visualization (charts, graphs)
- [ ] Multi-location comparison
- [ ] Email notifications
- [ ] Authentication and user accounts

## Troubleshooting

### Issue: "Invalid API Key"
- **Solution**: Verify your SerpAPI key is correct and has available credits

### Issue: "Webhook URL not working"
- **Solution**: Ensure N8N workflow is deployed and the webhook URL is correctly configured in index.html

### Issue: "No reviews returned"
- **Solution**: 
  - Verify the Google Maps URL is valid and contains a place ID
  - Check SerpAPI supports the location
  - Ensure your SerpAPI plan includes review access

### Issue: "Port 3000 already in use"
- **Solution**: Change the port in server.js:
  ```bash
  PORT=3001 npm start
  ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the [N8N Documentation](https://docs.n8n.io/)
- Visit [SerpAPI Documentation](https://serpapi.com/docs)

## Acknowledgments

- [N8N](https://n8n.io/) - Open-source workflow automation
- [SerpAPI](https://serpapi.com/) - Search Engine API
- [Express.js](https://expressjs.com/) - Web framework

1. Open `http://localhost:3000` in your web browser.

2. Enter a valid URL in the input field.

3. Click the "Analyze Sentiment" button.

4. The application will send a POST request to your N8N webhook with the URL and extracted info as JSON.

5. Check your N8N workflow for the received data.

## Webhook Endpoint

The server also provides a `/webhook` endpoint to receive incoming webhook data:

- **URL**: `http://localhost:3000/webhook`
- **Method**: POST
- **Content-Type**: application/json

Example request:
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from webhook"}'
```

The server will log the received data to the console.

## Notes

- The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable.
- If you encounter CORS issues, you may need to configure your N8N instance or add CORS middleware to the server.
- Ensure your N8N webhook is configured to accept POST requests and handle JSON payloads.

## Dependencies

- Express.js - Web framework for Node.js