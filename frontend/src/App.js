import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserGigs from './components/UserGigs'; // User gigs page component
import AdminGigs from './components/AdminGigs'; // Admin gigs page component
import './App.css';

const App = () => {
    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole'); // Retrieve role from local storage
    });

    const handleLogin = (role) => {
        setUserRole(role);
        localStorage.setItem('userRole', role);
    };

    const handleLogout = () => {
        setUserRole(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('username'); // Remove username on logout
    };

    return (
        <Router>
            <AppContent userRole={userRole} handleLogout={handleLogout} onLogin={handleLogin} />
        </Router>
    );
};

const AppContent = ({ userRole, handleLogout, onLogin }) => {
    const location = useLocation();
    const hideHeader = location.pathname === '/' || location.pathname === '/login'; // Show header only on register and login pages
    const username = localStorage.getItem('username'); // Get the username from localStorage

    return (
        <div>
            {/* Conditionally render header and nav links only on Register and Login pages */}
            {hideHeader && (
                <>
                    <h1>Ready Gigs Center</h1>
                    <nav>
                        <Link to="/">Register</Link> | 
                        <Link to="/login">Login</Link>
                    </nav>
                </>
            )}

            {/* Render Logout button and "Hi <username>" on other pages */}
            {!hideHeader && userRole && (
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        {username && <span>Hi, {username}</span>}
                    </div>
                    <button onClick={handleLogout}>Logout</button>
                </nav>
            )}

            {/* Routes for different pages */}
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login onLogin={onLogin} />} />

                {/* Admin route */}
                <Route path="/admin" element={userRole === 'admin' ? <AdminGigs /> : <Navigate to="/login" />} />

                {/* Gigs route with role-based conditional rendering */}
                <Route path="/gigs" element={
                    userRole === 'admin' ? <AdminGigs /> 
                    : userRole === 'user' ? <UserGigs /> 
                    : <Navigate to="/login" />
                } />

                {/* Catch-all route: Redirect any undefined routes to "/login" */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
};

export default App;