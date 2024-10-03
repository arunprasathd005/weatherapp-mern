import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const loginStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  heading: {
    marginBottom: '20px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
      const result = await response.json();
      localStorage.setItem("token",result.token);
      console.log(result); // Handle success or error message
      navigate('/dashboard'); // Navigate to user dashboard or other page after login
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div style={loginStyles.container}>
      <h1 style={loginStyles.heading}>Login</h1>
      <form style={loginStyles.form} onSubmit={handleSubmit}>
        <div style={loginStyles.formGroup}>
          <label htmlFor="email" style={loginStyles.label}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={loginStyles.input}
            required
          />
        </div>
        <div style={loginStyles.formGroup}>
          <label htmlFor="password" style={loginStyles.label}>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={loginStyles.input}
            required
          />
        </div>
        <button
          type="submit"
          style={loginStyles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = loginStyles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = loginStyles.button.backgroundColor}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
