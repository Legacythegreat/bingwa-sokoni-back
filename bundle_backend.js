// Backend: server.js (Node.js with Express)
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for your Vercel frontend
app.use(cors({
    origin: "https://bingwa-sokoni.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Data Bundles
const dataBundles = [
    { id: 1, name: '1.5GB', price: 50, validity: '3 Hours' },
    { id: 2, name: '1.25GB', price: 55, validity: 'Till Midnight' },
    { id: 3, name: '350MB', price: 49, validity: '7 Days' },
    { id: 4, name: '1GB', price: 19, validity: '1 Hour' },
    { id: 5, name: '1GB', price: 99, validity: '24 Hours' },
    { id: 6, name: '250MB', price: 20, validity: '24 Hours' }
];

// Minutes
const minutes = [
    { id: 11, name: '45 MINS', price: 22, validity: '3 Hour' },
];

// SMS Offers
const smsOffers = [
    { id: 13, name: '1500 SMS', price: 100, validity: '30 Days' },
    { id: 14, name: '1000 SMS', price: 30, validity: '7 Days' },
    { id: 15, name: '100 SMS', price: 23, validity: '7 Days' },
    { id: 16, name: '200 SMS', price: 10, validity: '24 Hours' },
    { id: 17, name: '20 SMS', price: 5, validity: '24 Hours' }
];

// Define separate endpoints for each category
app.get('/bundles', (req, res) => {
    res.json(dataBundles);
});

app.get('/minutes', (req, res) => {
    res.json(minutes);
});

app.get('/sms', (req, res) => {
    res.json(smsOffers);
});

// Endpoint for handling purchase confirmation from MPesa backend
app.post('/confirm-payment', (req, res) => {
    const { phoneNumber, bundleId } = req.body;
    const allProducts = [...dataBundles, ...minutes, ...smsOffers];
    const bundle = allProducts.find(b => b.id === bundleId);
    if (!bundle) {
        return res.status(404).json({ message: 'Bundle not found' });
    }
    res.json({ message: `Payment confirmed. ${bundle.name} activated for ${phoneNumber}` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
