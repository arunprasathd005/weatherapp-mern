import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const signUpStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #74ebd5, #ACB6E5)',
    fontFamily: '"Poppins", sans-serif',
  },
  heading: {
    marginBottom: '20px',
    color: '#ffffff',
    fontSize: '2.5rem',
    fontWeight: '600',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    animation: 'fadeInUp 0.8s ease-out',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '1rem',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  button: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #007bff, #6a11cb)',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  buttonHover: {
    transform: 'scale(1.02)',
  },
  errorMessage: {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '5px',
  },
  successModal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease',
  },
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email';
    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const response = await fetch('http://localhost:5001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Signed up successfully!');
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/login');
        }, 3000);
      } else if (result.message === 'User already exists') {
        setErrors({ apiError: 'User already exists. Try another account.' });
        setTimeout(() => {
          navigate('/login');
        }, 3000);  // Redirect to login after 3 seconds
      } else {
        setErrors({ apiError: result.message || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      setErrors({ apiError: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div style={signUpStyles.container}>
      <h1 style={signUpStyles.heading}>Sign Up</h1>
      <form style={signUpStyles.form} onSubmit={handleSubmit}>
        <div style={signUpStyles.formGroup}>
          <label htmlFor="name" style={signUpStyles.label}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={signUpStyles.input}
            onFocus={(e) => (e.target.style.borderColor = signUpStyles.inputFocus.borderColor)}
            required
          />
          {errors.name && (
            <p style={signUpStyles.errorMessage}>{errors.name}</p>
          )}
        </div>
        <div style={signUpStyles.formGroup}>
          <label htmlFor="email" style={signUpStyles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={signUpStyles.input}
            required
          />
          {errors.email && (
            <p style={signUpStyles.errorMessage}>{errors.email}</p>
          )}
        </div>
        <div style={signUpStyles.formGroup}>
          <label htmlFor="password" style={signUpStyles.label}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={signUpStyles.input}
            required
          />
          {errors.password && (
            <p style={signUpStyles.errorMessage}>{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          style={signUpStyles.button}
          onMouseOver={(e) => (e.target.style.transform = signUpStyles.buttonHover.transform)}
          onMouseOut={(e) => (e.target.style.transform = 'none')}
        >
          Sign Up
        </button>
        {errors.apiError && (
          <p style={signUpStyles.errorMessage}>{errors.apiError}</p>
        )}
      </form>

      {successMessage && (
        <div style={signUpStyles.successModal}>
          <h2>{successMessage}</h2>
        </div>
      )}
    </div>
  );
};

export default SignUp;
