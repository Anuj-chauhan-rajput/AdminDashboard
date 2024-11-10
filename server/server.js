require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const employeeRoutes = require('./routes/employee');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));  // Allow CORS for frontend
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files for images

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB is connected');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Test Route
app.get('/', (req, res) => res.send('Server is running'));

// API Routes
app.use('/api', loginRoute);
app.use('/api', registerRoute);
app.use('/api/employees', employeeRoutes);
app.use('/uploads', express.static('uploads'));


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
