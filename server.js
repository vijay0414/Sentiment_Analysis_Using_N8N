const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname)));

// Add this to your server.js
let reviewsList = []; // Array to store reviews in memory

// Webhook endpoint to receive incoming data
app.post('/webhook', (req, res) => {
    console.log('Received webhook data:', req.body);
    // Make sure we extract the correct field from n8n
    const reviewText = req.body.review || req.body.content || "Empty Review";
    reviewsList.push(reviewText);
    res.status(200).json({ status: 'success' });
});

// The route your frontend is calling
app.get('/reviews', (req, res) => {
    res.json({ reviews: reviewsList }); // Wrap in an object to match your frontend logic
});

// Endpoint to clear reviews
app.post('/clear-reviews', (req, res) => {
    reviewsList = [];
    console.log('Reviews cleared');
    res.status(200).json({ status: 'cleared' });
});

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});