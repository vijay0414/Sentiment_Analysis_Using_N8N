# Sentiment Analysis Using N8N

A powerful web application that analyzes sentiment from both Google Maps reviews and Amazon product reviews using N8N workflow automation. This project extracts reviews from Google Maps locations and Amazon products, aggregates them, and provides sentiment analysis capabilities.

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

This application combines the power of N8N workflow automation with a web-based frontend to analyze sentiment from both Google Maps reviews and Amazon product reviews. It automatically fetches reviews for specific locations and products, processes them through an N8N workflow for sentiment analysis, and provides a unified interface for managing review data.

## Features

- ✅ **Google Maps Integration**: Extracts place information and reviews from Google Maps
- ✅ **Amazon Product Reviews**: Fetches and analyzes customer reviews from Amazon products
- ✅ **N8N Automation**: Automated workflow for review collection and processing
- ✅ **Web Interface**: Clean, responsive UI for submitting URLs (Google Maps or Amazon)
- ✅ **Review Management**: Store and manage collected reviews in memory
- ✅ **SerpAPI Integration**: Uses SerpAPI for accessing Google Maps and Amazon data
- ✅ **Real-time Webhook Processing**: Receives and processes webhook data from N8N
- ✅ **RESTful API**: Easy-to-use endpoints for managing reviews
- ✅ **Express Backend**: Lightweight Node.js server for serving and managing requests
- ✅ **Multi-Source Analysis**: Compare sentiment across different platforms

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (index.html)               │
│              User Interface for URL Submission            │
│              (Google Maps or Amazon Product URLs)         │
└──────────────────┬──────────────────────────────────────┘
                   │ POST (URL)
                   ▼
┌─────────────────────────────────────────────────────────┐
│                   N8N Workflow                           │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │   Webhook    │───▶│  If (Check   │                  │
│  │   Receiver   │    │   URL Type)  │                  │
│  └──────────────┘    └──────┬───────┘                  │
│                             │                           │
│  ┌──────────────┐    ┌──────▼───────┐    ┌──────────────┐ │
│  │ Google Maps  │◀───│   Route to   │───▶│ Amazon       │ │
│  │   Path       │    │   Processor  │    │ Product Path │ │
│  └──────┬───────┘    └──────────────┘    └──────┬───────┘ │
│         │                                        │         │
│  ┌──────▼───────────────────────────────────┐    ┌──────▼───────┐ │
│  │  SerpAPI - Google Maps Engine            │    │  SerpAPI -    │ │
│  │  - Extract place name                     │    │  Amazon Engine │ │
│  │  - Get place info & reviews               │    │  - Get product│ │
│  └──────┬──────────────────────────────────┘    │     reviews    │ │
│         │                                        └──────┬───────┘ │
│  ┌──────▼───────────────────────────────────┐           │         │
│  │   Process & Return Reviews                │    ┌──────▼───────┐ │
│  │   (Sentiment Analysis Ready)              │    │   Process &   │ │
│  │                                           │    │   Return      │ │
│  └───────────────────────────────────────────┘    │   Reviews     │ │
│                                                   │   (Sentiment   │ │
│                                                   │    Analysis    │ │
│                                                   │     Ready)     │ │
│                                                   └───────────────┘ │
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
- An **Amazon Product URL** (e.g., https://www.amazon.com/dp/B08N5WRWNW)

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
2. Enter a URL:
   - **Google Maps**: Enter a Google Maps location URL (e.g., https://www.google.com/maps/place/Statue+of+Liberty/...)
   - **Amazon Product**: Enter an Amazon product URL (e.g., https://www.amazon.com/dp/B08N5WRWNW)
3. Click **Submit**
4. The N8N workflow will:
   - Detect the URL type (Google Maps or Amazon)
   - Extract the relevant information (place name or product ID)
   - Fetch reviews using SerpAPI
   - Send the reviews to your backend
5. View collected reviews in the application

### Via API

#### Submit a Google Maps URL to N8N Workflow

```bash
curl -X POST https://your-n8n-instance.com/webhook/sentiment-analysis \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com/maps/place/Statue+of+Liberty/..."}'
```

#### Submit an Amazon Product URL to N8N Workflow

```bash
curl -X POST https://your-n8n-instance.com/webhook/sentiment-analysis \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.amazon.com/dp/B08N5WRWNW"}'
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
    "Highly recommended...",
    "This product exceeded my expectations!",
    "Great value for money..."
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

#### Google Maps Review Payload
```json
{
  "review": "Great place to visit! Amazing experience with friendly staff.",
  "place_id": "ChIJd8rqiQawMzMRlT94X3kIi3g",
  "rating": 4.5,
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "google_maps",
  "place_name": "Statue of Liberty"
}
```

#### Amazon Product Review Payload
```json
{
  "review": "This product exceeded my expectations! Great value for money.",
  "rating": 5,
  "title": "Excellent Product",
  "reviewer": "John Doe",
  "date": "2024-01-15",
  "verified_purchase": true,
  "helpful_votes": 12,
  "source": "amazon",
  "product_asin": "B08N5WRWNW",
  "product_title": "Wireless Bluetooth Headphones"
}
```

## N8N Workflow

### Workflow Components

The `Sentiment Analysis.json` workflow includes:

1. **Webhook Trigger**: Receives incoming URLs (Google Maps or Amazon)
2. **URL Type Detection**: Determines if URL is Google Maps or Amazon product
3. **Conditional Routing**: Routes to appropriate processing path
4. **Google Maps Path**:
   - Place Name Extractor: Uses regex to extract location name from URL
   - Google Maps API Call: Fetches place information using SerpAPI
   - Reviews Fetcher: Retrieves reviews for the place
5. **Amazon Product Path**:
   - Product ID Extractor: Extracts ASIN from Amazon URL
   - Amazon API Call: Fetches product reviews using SerpAPI
   - Reviews Processor: Formats Amazon review data
6. **Data Processor**: Processes and formats the data from both sources
7. **Webhook Response**: Sends collected data to backend

### How It Works

1. User submits a URL via the frontend (Google Maps or Amazon)
2. N8N webhook receives the URL
3. Workflow detects URL type and routes accordingly:
   - **Google Maps**: Extracts place name → Fetches place details and reviews
   - **Amazon**: Extracts product ASIN → Fetches product reviews
4. SerpAPI is called with appropriate engine:
   - `google_maps` and `google_maps_reviews` for Google Maps
   - `amazon_product` for Amazon reviews
5. Reviews are processed and sent back to the Express backend
6. Backend stores reviews for analysis and display

### Supported URL Formats

- **Google Maps**: `https://www.google.com/maps/place/...`
- **Amazon**: `https://www.amazon.com/dp/ASIN` or `https://www.amazon.com/product-name/dp/ASIN`

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

- [ ] Implement actual sentiment analysis (using libraries like sentiment.js or natural language processing)
- [ ] Database integration (MongoDB, PostgreSQL) for persistent storage
- [ ] Advanced filtering and search capabilities (by rating, date, platform)
- [ ] Sentiment visualization (charts, graphs, word clouds)
- [ ] Multi-source comparison (Google Maps vs Amazon reviews)
- [ ] Product vs Location sentiment correlation analysis
- [ ] Review language detection and translation
- [ ] Export functionality (CSV, PDF reports)
- [ ] Email notifications for new reviews
- [ ] Authentication and user accounts
- [ ] Review spam detection and filtering
- [ ] Integration with additional review platforms (Yelp, TripAdvisor, etc.)

## Troubleshooting

### Issue: "Invalid API Key"
- **Solution**: Verify your SerpAPI key is correct and has available credits

### Issue: "Webhook URL not working"
- **Solution**: Ensure N8N workflow is deployed and the webhook URL is correctly configured in index.html

### Issue: "No reviews returned"
- **Solution**:
  - **For Google Maps**: Verify the URL is valid and contains a place ID, check SerpAPI supports the location
  - **For Amazon**: Verify the product URL contains a valid ASIN (Amazon Standard Identification Number)
  - Ensure your SerpAPI plan includes review access for both Google Maps and Amazon

### Issue: "URL not recognized"
- **Solution**: Ensure you're using supported URL formats:
  - Google Maps: `https://www.google.com/maps/place/...`
  - Amazon: `https://www.amazon.com/dp/ASIN` or `https://www.amazon.com/product-name/dp/ASIN`

### Issue: "Amazon product not found"
- **Solution**: Verify the Amazon product exists and is available in your region. Some products may not have reviews or may be region-locked.

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