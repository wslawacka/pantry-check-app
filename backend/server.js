const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

// load environment variables
dotenv.config();

const app = express();

// middleware
app.use(express.json());

// routes
app.use('/api/users', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  ssl: true
})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 5001, () => {
            console.log(`Server is running on port ${process.env.PORT || 5001}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

