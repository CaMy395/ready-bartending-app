import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, { // Using environment variable for API URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Send username and password
            });

            if (response.ok) {
                const { role } = await response.json(); // Get the user role from the response

                // Store the username and role in localStorage
                localStorage.setItem('username', username);
                localStorage.setItem('role', role);

                // Pass the role to onLogin
                onLogin(role);

                // Redirect based on the role
                if (role === 'admin') {
                    navigate('/admin'); // Admin goes to admin page
                } else {
                    navigate('/gigs'); // Regular users go to gigs page
                }
            } else {
                const errorText = await response.text();
                setError(errorText || 'Login failed. Please check your credentials.'); // More user-friendly error message
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.'); // Generic error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <br />
            <button type="submit" disabled={loading}> {/* Disable button during loading */}
                {loading ? 'Logging in...' : 'Login'} {/* Change button text */}
            </button>
        </form>
    );
};

export default Login;
