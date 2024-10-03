// models/WeatherData.js
const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
    location: String,
    temperature: Number,
    humidity: Number,
    dateTime: Date
});

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

module.exports = WeatherData;
