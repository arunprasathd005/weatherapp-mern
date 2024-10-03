const express = require('express');
const cors = require('cors');
const axios = require('axios');
// const bodyParser = require('body-parser');
const connectDB = require('./configuration/db');
const signUproutes = require('./routes/signUproutes');
const loginroutes =require('./routes/loginroutes'); 
const weatherRoutes =require('./routes/weatherRoutes');
const createAdminAccount=require('./scripts/admin');

const apiKey = '336f3097ab5094ba91c87ea89c0de8e7';

const app = express();
const port = 5001; // You can change the port as needed

// Connect to the database
connectDB();



// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
})); // CORS middleware should be used before routes
app.use(express.json()); // Parse incoming JSON requests

createAdminAccount();
// Endpoint to fetch current weather data
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    res.status(500).json({ error: 'Error fetching weather' });
  }
});
// Endpoint to fetch weather alerts
app.get('/weather/alerts', async (req, res) => {
  const { city } = req.query;
  const apiUrl = `https://api.openweathermap.org/data/2.5/alerts?q=${city}&appid=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    console.log(response.data); // Log the response for debugging
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather alerts:', error.message);
    res.status(500).json({ error: 'Error fetching weather alerts' });
  }
});

// Endpoint to fetch 7-day weather forecast
app.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    console.log(response.data); // Log the response for debugging
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    res.status(500).json({ error: 'Error fetching forecast' });
  }
});

// Routes
app.use('/user', signUproutes); // Handle routes starting with /user
app.use("/auth", loginroutes);
app.use('/api', weatherRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
