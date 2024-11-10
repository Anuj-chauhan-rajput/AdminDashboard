// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                f_userName: username,
                f_Pwd: password,
            });
            if (response.status === 200) {
                localStorage.setItem('username', username);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" required />
                <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>Login</Button>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </form>
            <Typography align="center" sx={{ mt: 2 }}>Don't have an account? <a href="/register">Register here</a></Typography>
        </Container>
    );
};

export default Login;
