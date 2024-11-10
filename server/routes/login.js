// routes/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Login = require('../models/Login');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { f_userName, f_Pwd } = req.body;

    if (!f_userName || !f_Pwd) {
        return res.status(400).json({ message: 'Please provide both username and password' });
    }

    try {
        const user = await Login.findOne({ f_userName });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
