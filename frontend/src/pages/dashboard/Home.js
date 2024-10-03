import React, { useEffect, useState } from 'react';

const Home = () => {
  const [weather, setWeather] = useState('sunny'); // Example state for weather

  useEffect(() => {
    // Simulate weather change
    const weatherConditions = ['sunny', 'rainy', 'cloudy', 'snowy'];
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    setWeather(randomWeather);
  }, []);

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    transition: 'background 2s ease-in-out',
    ...(weather === 'sunny' && {
      background: 'linear-gradient(to top, #f7b733, #fc4a1a)',
    }),
    ...(weather === 'rainy' && {
      background: 'linear-gradient(to top, #00c6ff, #0072ff)',
      animation: 'rainAnimation 3s infinite linear',
    }),
    ...(weather === 'cloudy' && {
      background: 'linear-gradient(to top, #d3cce3, #e9e4f0)',
    }),
    ...(weather === 'snowy' && {
      background: 'linear-gradient(to top, #83a4d4, #b6fbff)',
      animation: 'snowAnimation 5s infinite linear',
    }),
  };

  const titleStyle = {
    fontSize: '3rem',
    animation: 'fadeIn 2s ease-in-out',
  };

  const weatherIconStyle = {
    fontSize: '50px',
    marginTop: '20px',
  };

  const weatherIcons = {
    sunny: '☀️',
    rainy: '🌧️',
    cloudy: '☁️',
    snowy: '❄️',
  };

  return (
    <div style={containerStyle}>
      <div className="weather-info">
        <h1 style={titleStyle}>Welcome to Weather Home</h1>
        <p>Current Weather: {weather}</p>
        <div style={weatherIconStyle}>{weatherIcons[weather]}</div>
      </div>

      {/* CSS for Animations */}
      <style>{`
        @keyframes rainAnimation {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }

        @keyframes snowAnimation {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Home;
