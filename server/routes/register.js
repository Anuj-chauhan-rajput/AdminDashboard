// routes/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Login = require('../models/Login');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { f_sno, f_userName, f_Pwd } = req.body;

    if (!f_sno || !f_userName || !f_Pwd) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the username already exists
        const existingUser = await Login.findOne({ f_userName });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(f_Pwd, 10);

        // Create and save the new user
        const newUser = new Login({ f_sno, f_userName, f_Pwd: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
