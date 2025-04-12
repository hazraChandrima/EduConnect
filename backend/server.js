require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Core Middleware
app.use(express.json());
app.use(mongoSanitize()); 

// Apply Security Middleware
require('./middleware/security')(app);


// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running securely on port ${PORT}`)
);
