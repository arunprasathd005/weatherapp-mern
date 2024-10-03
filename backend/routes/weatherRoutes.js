// server.js or routes/weatherRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const WeatherData = require('../models/WeatherData');


const router = express.Router();

router.post('/saveWeatherData', async (req, res) => {
    try {
        const { location, temperature, humidity, dateTime } = req.body;

        const weatherData = new WeatherData({
            location,
            temperature,
            humidity,
            dateTime
        });

        await weatherData.save();
        res.status(200).json({ message: 'Weather data saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
