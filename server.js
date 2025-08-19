const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 5500;

app.use(express.static('public')); // Serve static files from 'public/'

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/get-info', async (req, res) => {
    try {
        const ipResponse = await axios.get('https://ipapi.co/json/');
        const { ip, city, region, country_name, country } = ipResponse.data;

        const countryRes = await axios.get(`https://restcountries.com/v3.1/alpha/${country}`);
        const population = countryRes.data?.[0]?.population || 'Unknown';

        res.json({
            ip,
            city,
            region,
            country: country_name,
            population
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch IP or country data' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

