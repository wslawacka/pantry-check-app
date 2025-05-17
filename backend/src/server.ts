import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';
import { pantryRoutes } from './routes/pantryItemRoutes';

// load environment variables
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/pantryItems', pantryRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string, {
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

