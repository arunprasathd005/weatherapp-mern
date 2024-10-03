import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ showLogout, weatherCondition = 'sunny' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/login');
  };

  // Weather-themed background gradients
  const weatherBackgrounds = {
    sunny: 'linear-gradient(90deg, #f7b733, #fc4a1a)',
    rainy: 'linear-gradient(90deg, #00c6ff, #0072ff)',
    cloudy: 'linear-gradient(90deg, #d3cce3, #e9e4f0)',
    snowy: 'linear-gradient(90deg, #83a4d4, #b6fbff)',
  };

  // Define inline styles with weather theme
  const navbarStyle = {
    background: weatherBackgrounds[weatherCondition] || '#333',
    color: '#fff',
    padding: '10px 0',
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: '1000',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 1.5s ease-in-out',
    // Add a height to the header to ensure it doesn’t overlap other content
    height: '60px', // Adjust as needed
  };
  

  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  };

  const logoStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: '2px',
    animation: 'slideIn 2s ease-in-out',
  };

  const navLinksStyle = {
    listStyle: 'none',
    display: 'flex',
    margin: '0',
    padding: '0',
  };

  const navLinkStyle = {
    marginLeft: '20px',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
    transition: 'color 0.3s ease',
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  };

  // const navLinkHoverStyle = {
  //   color: '#ffd700',
  // };

  return (
    <header style={navbarStyle}>
      <nav style={navContainerStyle}>
        <h1 style={logoStyle}>WeatherApp</h1>
        <ul style={navLinksStyle}>
          {showLogout ? (
            <>
          <li>
            <Link 
              to="/interActiveMap" 
              style={navLinkStyle} 
              onMouseEnter={(e) => e.target.style.color = '#ffd700'}
              onMouseLeave={(e) => e.target.style.color = '#fff'}
            >
              Map
            </Link>
          </li>
            <li>
              <button
                style={buttonStyle}
                onMouseEnter={(e) => e.target.style.color = '#ffd700'}
                onMouseLeave={(e) => e.target.style.color = '#fff'}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  style={navLinkStyle} 
                  onMouseEnter={(e) => e.target.style.color = '#ffd700'}
                  onMouseLeave={(e) => e.target.style.color = '#fff'}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  style={navLinkStyle} 
                  onMouseEnter={(e) => e.target.style.color = '#ffd700'}
                  onMouseLeave={(e) => e.target.style.color = '#fff'}
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(-100px); }
          to { transform: translateX(0); }
        }

        button:hover, a:hover {
          color: #ffd700;
        }
      `}</style>
    </header>
  );
};

export default Header;
