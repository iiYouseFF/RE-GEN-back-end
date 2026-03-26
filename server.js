import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import productRoutes from './routes/productRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();

// Security and Performance Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(compression());

// Body parser with size limit to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));

// Global Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7', // combined RateLimit header
    legacyHeaders: false, // Disable X-RateLimit-* headers
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiter to all /api routes
app.use('/api', limiter);

// Route Links
app.use('/api/products', productRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`RE-GEN Server running on port ${PORT}`));