import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import productRoutes from './routes/productRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security and Performance Middleware
app.use(helmet());

// CORS — driven by env var; falls back to localhost for local development
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Use 'combined' (Apache-style) in production for log aggregators, 'dev' locally
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
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

// Health checks
app.get('/', (req, res) => {
    res.json({ success: true, message: 'RE-GEN Server is running!' });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Route Links
app.use('/api/products', productRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`RE-GEN Server running on port ${PORT}`));
}

export default app;