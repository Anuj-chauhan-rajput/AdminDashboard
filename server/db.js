const express = require('express');
const bcrypt = require('bcryptjs'); // to hash and compare passwords
const Login = require('../models/Login'); // Mongoose model for login
const router = express.Router();

// POST /api/login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Request Body:', req.body);  // Debugging log

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    // Find the user by username
    const user = await Login.findOne({ f_userName: username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.f_Pwd);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Respond with success message or token
    res.json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
