// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@mui/material';

const Register = () => {
    const navigate = useNavigate();
    const [sno, setSno] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ f_sno: sno, f_userName: username, f_Pwd: password }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Create Account</Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Sno" value={sno} onChange={(e) => setSno(e.target.value)} margin="normal" required />
                <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" required />
                <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>Register</Button>
            </form>
            <Typography align="center" sx={{ mt: 2 }}>Already have an account? <a href="/login">Login here</a></Typography>
        </Container>
    );
};

export default Register;
