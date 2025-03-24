const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for your frontend
app.use(cors({
    origin: "https://bingwa-sokoni.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const TILL_NUMBER = process.env.MPESA_TILL_NUMBER;
const CALLBACK_URL = process.env.CALLBACK_URL || "https://bingwa-sokoni.onrender.com/mpesa/callback";
const PASSKEY = process.env.MPESA_PASSKEY;

async function getAccessToken() {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: { Authorization: `Basic ${auth}` }
    });
    return response.data.access_token;
}

app.post('/mpesa-payment', async (req, res) => {
    try {
        const { phoneNumber, amount } = req.body;
        const token = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);

        // Generate STK push password
        const password = Buffer.from(`${TILL_NUMBER}${PASSKEY}${timestamp}`).toString("base64");

        const response = await axios.post('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: TILL_NUMBER,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: TILL_NUMBER,
            PhoneNumber: phoneNumber,
            CallBackURL: CALLBACK_URL,
            AccountReference: "BundlePurchase",
            TransactionDesc: "Buying data bundles"
        }, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });

        res.json({ message: "MPesa payment initiated, check your phone!", data: response.data });
    } catch (error) {
        res.status(500).json({ message: "Payment failed", error: error.response?.data || error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
