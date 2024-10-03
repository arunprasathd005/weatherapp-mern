import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './pages/header/header'; // Note the capitalization for consistency
import Login from './pages/auth/login/login';
import Signup from './pages/auth/sigup/signUp'; // Fixed typo in import path
import DashBoard from './pages/dashboard/DashBoard';
import ProtectedRoute from './components/protectedRoutes'; // Import ProtectedRoute
import Home from './pages/dashboard/Home';


// Custom component to check if the current path is /dashboard
const AppHeader = () => {
  const location = useLocation();
  const isDashboardPage = location.pathname === '/dashboard';
  
  return <Header showLogout={isDashboardPage} />;
};

function App() {
  return (
    <Router>
      <div>
        <AppHeader /> {/* Use AppHeader to dynamically set the header */}
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
