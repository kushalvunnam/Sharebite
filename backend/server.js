import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus, isMemoryFallback } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from root or backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const allowedOrigins = [
  CLIENT_URL,
  'https://sharebite-lovat.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];

// CORS configuration for authorized client origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV === 'development'
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Access denied for this origin.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'ShareBite REST API',
    version: '2.0.0',
    health: '/api/health',
  });
});

// Health alias
app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// Health endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const memoryFallback = isMemoryFallback();
  const isProd = process.env.NODE_ENV === 'production';
  const isHealthy = dbStatus === 'connected' && (!isProd || !memoryFallback);

  const statusCode = isHealthy ? 200 : (isProd ? 503 : 200);

  res.status(statusCode).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'ShareBite REST API',
    version: '2.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    persistent: !memoryFallback && dbStatus === 'connected',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Database connection readiness check middleware for API routes
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (getDBStatus() !== 'connected') {
    return res.status(503).json({
      success: false,
      message: 'Database service is currently unavailable or connecting. Please try again shortly.',
      databaseStatus: getDBStatus(),
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Fallback error handlers
app.use(notFound);
app.use(errorHandler);

// Connect database and start server (except when imported in tests)
const isTestEnv =
  process.env.NODE_ENV === 'test' ||
  Boolean(process.env.NODE_TEST_CONTEXT) ||
  process.argv.some((a) => a.includes('test'));

if (!isTestEnv) {
  // Listen on PORT immediately so host platform (Render) detects open port without delay
  app.listen(PORT, () => {
    console.log(`[ShareBite API] Backend server running on port ${PORT}`);
    console.log(`[ShareBite API] Health check available at http://localhost:${PORT}/api/health`);
  });

  connectDB().catch((err) => {
    console.error('[ShareBite DB] Background DB connection error:', err.message);
  });
}

export default app;
