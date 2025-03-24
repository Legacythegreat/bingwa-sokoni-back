// Backend: bundle_backend.js (Node.js with Express)
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Updated bundle options from Bingwa Sokoni
const bundles = [
    { id: 1, name: '1.25GB (Buy only once)', price: 55, validity: 'Midnight' },
    { id: 2, name: '2GB (Buy only once)', price: 25, validity: '1 Hour' },
    { id: 3, name: '1.5GB (Buy only once)', price: 50, validity: '3 Hours' },
    { id: 4, name: '350MB (Buy only once)', price: 49, validity: '7 Days' },
    { id: 5, name: '1GB (Buy only once)', price: 19, validity: '1 Hour' },
    { id: 6, name: '250MB (Buy only once)', price: 20, validity: '24 Hours' },
    { id: 7, name: '2GB', price: 110, validity: '24 Hours' },
    { id: 8, name: '1GB', price: 95, validity: '24 Hours' },
    { id: 9, name: '8GB + 400 MINS', price: 940, validity: '30 Days' },
    { id: 10, name: '10GB', price: 940, validity: '30 Days' },
    { id: 11, name: '300 MINS', price: 450, validity: '30 Days' },
    { id: 12, name: '800 MINS', price: 940, validity: '30 Days' }
];

app.get('/bundles', (req, res) => {
    res.json(bundles);
});

app.post('/purchase', (req, res) => {
    const { bundleId, phoneNumber } = req.body;
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) {
        return res.status(404).json({ message: 'Bundle not found' });
    }
    res.json({ message: `Purchase successful for ${bundle.name} on ${phoneNumber}` });
});

app.listen(PORT, () => console.log(`Bundle server running on port ${PORT}`));
