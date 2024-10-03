import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import clearsky from '../assests/clearsky.jpg';
import cloudy from '../assests/cloudy.jpg';
import rainy from '../assests/rainy.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is imported
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
 import L from 'leaflet';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

const API_KEY = '336f3097ab5094ba91c87ea89c0de8e7';

const DashBoard = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [backgroundImage, setBackgroundImage] = useState(clearsky);
    const [alerts, setAlerts] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState([0, 0]) // Initialize location

    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                }
            });
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const fetchWeather = async (cityName) => {
        setLoading(true);
        try {
            // Fetch current weather data
            const weatherResponse = await axios.get(`http://localhost:5001/weather?city=${encodeURIComponent(cityName)}`);
            setWeatherData(weatherResponse.data);

            const lat = weatherResponse.data.coord.lat;
            const lon = weatherResponse.data.coord.lon;
            setLocation([lat, lon]); // Update location state with fetched coordinates

            // Fetch 4-day forecast
            const forecastResponse = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&cnt=5&appid=${API_KEY}`);
            setForecastData(forecastResponse.data.list);

            // Prepare data for MongoDB
            const weatherDataToSave = {
                location: cityName,
                temperature: weatherResponse.data.main.temp,
                humidity: weatherResponse.data.main.humidity,
                dateTime: new Date()
            };

            // Send data to backend
            await axios.post('http://localhost:5001/api/saveWeatherData', weatherDataToSave);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchNearbyCities = async (lat, lon) => {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=30&appid=${API_KEY}&units=metric`);
          
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchWeather(city);
    };

    useEffect(() => {
        fetchWeather('New York');
    }, []);

    useEffect(() => {
        if (weatherData) {
            const weatherCondition = weatherData.weather[0].main;
            switch (weatherCondition) {
                case 'Clear':
                    setBackgroundImage(clearsky);
                    break;
                case 'Rain':
                    setBackgroundImage(rainy);
                    break;
                case 'Clouds':
                    setBackgroundImage(cloudy);
                    break;
                default:
                    setBackgroundImage(clearsky);
            }
        }
    }, [weatherData]);

    useEffect(() => {
        if (alerts && alerts.length > 0) {
            alerts.forEach(alert => {
                if (Notification.permission === 'granted') {
                    new Notification('Weather Alert', {
                        body: alert.description,
                        icon: backgroundImage
                    });
                }
            });
        }
    }, [alerts]);
    // Example useEffect to update location based on fetched weather data
useEffect(() => {
    if (weatherData) {
        const { lat, lon } = weatherData.coord; // Adjust according to your data structure
        setLocation([lat, lon]);
    }
}, [weatherData]);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        fontFamily: 'Arial, sans-serif',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '70px',
        borderRadius: '8px',
        height: '100vh',
        color: '#fff', // Ensure text is visible over background
        position: 'relative' // Ensures child elements are positioned correctly
    };

    const dashboardStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: '40px',
        zIndex: 10 // Ensure it's above the forecast panel
    };

    const forecastStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '300px', // Fixed width for the side panel
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        right: '100px', // Adjusted to ensure alignment
        top: '100px',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 10 ,
        color: 'black'// Ensure it's above other content
    };
    // const mapcastStyle = {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     width: '300px', // Fixed width for the side panel
    //     padding: '20px',
    //     borderRadius: '8px',
    //     backgroundColor: 'rgba(255, 255, 255, 0.8)',
    //     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    //     position: 'fixed',
    //     right: '500px', // Adjusted to ensure alignment
    //     top: '100px',
    //     maxHeight: '90vh',
    //     overflowY: 'auto',
    //     zIndex: 10 ,
    //     color: 'black'// Ensure it's above other content
    // };

    const formStyle = {
        marginBottom: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(200, 200, 255, 0.8))',  // Gradient background
        padding: '30px',  // Increased padding for a more spacious look
        borderRadius: '15px',  // Softer rounded corners
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',  // Stronger shadow for a more prominent look
        position: 'relative',
        zIndex: 20,
        color: 'black',
        right: '200px',
        border: '1px solid rgba(0, 123, 255, 0.3)',  // Light border with a subtle blue tint
    };
    
    const inputStyle = {
        padding: '12px',
        borderRadius: '8px',  // Softer corners for inputs
        border: '2px solid #ddd',
        width: '100%',
        maxWidth: '350px',  // Slightly wider input fields
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Add subtle shadow for depth
        fontSize: '16px',  // Larger font for better readability
        '&:focus': {
            borderColor: '#007bff',  // Change border color on focus
            boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)'  // Add glow effect on focus
        }
    };
    
    const buttonStyle = {
        padding: '12px 20px',
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(90deg, #007bff, #00ff77)',  // Gradient background for the button
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',  // Add subtle shadow for depth
        '&:hover': {
            background: 'linear-gradient(90deg, #0056b3, #00d977)',  // Darken gradient on hover
            transform: 'scale(1.05)',  // Slightly enlarge button on hover
            boxShadow: '0 7px 14px rgba(0, 123, 255, 0.5)'  // More shadow on hover
        }
    };
    

    const cardContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '800px',
        width: '100%',
        marginTop: '5px',
        marginLeft: '0',   // Ensure no left margin
        marginRight: '500px',
        
    };

    const cardStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer'
    };

    const cardHoverStyle = {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    };

    const iconStyle = {
        fontSize: '24px',
        color: '#007bff',
        marginBottom: '10px'
    };

    const titleStyle = {
        fontSize: '1.8rem',
        marginBottom: '14px',
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    
        // Gradient effect
        background: 'linear-gradient(90deg, #007bff, #00ff77)',  // Define the gradient
        WebkitBackgroundClip: 'text',  // Ensure the gradient is clipped to the text
        WebkitTextFillColor: 'transparent',  // Set text fill color to transparent so gradient shows
    };

    const dataStyle = {
        color: '#343a40',
        fontSize: '1.1rem',
        fontFamily: 'Arial, sans-serif',
        marginTop: '8px',
        lineHeight: '1.6',
    };

    const dateTimeStyle = {
        marginTop: '-425px',
        fontSize: '1.2rem',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '5px',
        marginRight: '800px',
        textAlign: 'center'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    };

    const tableHeaderStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px',
        textAlign: 'left'
    };

    const tableCellStyle = {
        padding: '8px',
        borderBottom: '1px solid #ddd'
    };
    const mapcastStyle = {
        height: '270px', // Fixed height for the map
        width: '600px', // Full width of the parent container
        margin: '100px auto 20px auto', // Center the map with auto left/right margins
        border: '2px solid #ccc', // Optional: Adds a border around the map
        borderRadius: '8px', // Optional: Rounds the corners
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', // Optional: Adds shadow for depth
        zIndex: 1, // Ensure it’s above other elements
        marginTop: '400px',
        marginRight: '400px'
    };
   
    
    
   

    return (
        <div style={containerStyle}>
            <div style={dashboardStyle}>
                <h1 style={titleStyle}>Weather Dashboard</h1>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <input
                        type="text"
                        value={city}
                        onChange={handleCityChange}
                        placeholder="Enter city"
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>Fetch Weather</button>
                </form>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {weatherData && (
                    <>
                        <div style={cardContainerStyle}>
                            <div
                                style={{ ...cardStyle, ...(hoverIndex === 0 ? cardHoverStyle : {}) }}
                                onMouseEnter={() => setHoverIndex(0)}
                                onMouseLeave={() => setHoverIndex(-1)}
                            >
                                <div style={iconStyle}>🌡️</div>
                                <h2 style={titleStyle}>Temperature</h2>
                                <p style={dataStyle}>{weatherData.main.temp} °C</p>
                            </div>
                            <div
                                style={{ ...cardStyle, ...(hoverIndex === 1 ? cardHoverStyle : {}) }}
                                onMouseEnter={() => setHoverIndex(1)}
                                onMouseLeave={() => setHoverIndex(-1)}
                            >
                                <div style={iconStyle}>💧</div>
                                <h2 style={titleStyle}>Humidity</h2>
                                <p style={dataStyle}>{weatherData.main.humidity} %</p>
                            </div>
                            <div
                                style={{ ...cardStyle, ...(hoverIndex === 2 ? cardHoverStyle : {}) }}
                                onMouseEnter={() => setHoverIndex(2)}
                                onMouseLeave={() => setHoverIndex(-1)}
                            >
                                <div style={iconStyle}>🌦️</div>
                                <h2 style={titleStyle}>Weather</h2>
                                <p style={dataStyle}>{weatherData.weather[0].description}</p>
                            </div>
                        </div>
                        <div style={dateTimeStyle}>
                            Current Time: {currentTime.toLocaleTimeString()}
                        </div>
                    
                {/* Map Section */}

    
        <MapContainer center={location} zoom={13}  style={mapcastStyle} >
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <Marker position={location} icon={L.icon({ iconUrl: 'marker-icon.png' })}>
    <Popup>
                        {weatherData ? `${weatherData.name}: ${weatherData.main.temp}°C` : "Loading..."}
                    </Popup>
    </Marker>
        </MapContainer>
        </>
    )}
          </div>
            
            
            
            <div style={forecastStyle}>
                <h2 style={titleStyle}>Weather Forecast</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Date</th>
                            <th style={tableHeaderStyle}>Time</th>
                            <th style={tableHeaderStyle}>Temperature</th>
                            <th style={tableHeaderStyle}>Weather</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecastData.map((item, index) => (
                            <tr key={index}>
                                <td style={tableCellStyle}>{item.dt_txt.split(' ')[0]}</td>
                                <td style={tableCellStyle}>{item.dt_txt.split(' ')[1]}</td>
                                <td style={tableCellStyle}>{item.main.temp} °C</td>
                                <td style={tableCellStyle}>{item.weather[0].description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* {nearbyCities.length > 0 && ( */}
    {/* <div style={mapcastStyle}> */}
        {/* <h2 style={titleStyle}>Nearby Cities</h2>
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={tableHeaderStyle}>City</th>
                    <th style={tableHeaderStyle}>Temperature (°C)</th>
                </tr>
            </thead>
            <tbody>
                {nearbyCities.map((city, index) => (
                    <tr key={index}>
                        <td style={tableCellStyle}>{city.name}</td>
                        <td style={tableCellStyle}>{city.main.temp}</td>
                    </tr>
                ))}
            </tbody>
        </table> */}
    {/* </div> */}
{/* )} */}



        </div>
    );
};

export default DashBoard;