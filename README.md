# N8N URL Sender with Webhook Server

A web application that includes a frontend for sending URLs to an N8N workflow and a backend server to handle incoming webhooks.

## Features

- Clean, responsive UI for entering URLs
- Validates URL input
- Sends POST request to N8N webhook with the URL as JSON payload
- Displays success/error messages
- Express server to serve the application and handle incoming webhooks

## Setup

1. Clone or download this project to your local machine.

2. Ensure you have Node.js installed (version 14 or higher).

3. Install dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Configuration

Before using the application, you need to update the webhook URL in the JavaScript code:

1. Open `index.html` in a text editor.

2. Find the line:
   ```javascript
   const webhookUrl = 'http://localhost:5678/webhook-test/752b8d6f-ad65-4bd4-a2ee-66a49ac43926';
   ```

3. Replace with your actual N8N webhook URL.

   - To get your N8N webhook URL:
     - In your N8N instance, create or open a workflow.
     - Add a "Webhook" node.
     - Copy the webhook URL from the node settings.

## Usage

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