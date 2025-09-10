import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports
import questionRoutes from './routes/questions.js';
import tagRoutes from './routes/tags.js';
import statsRoutes from './routes/stats.js';
import roundsRoutes from './routes/rounds.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(cors());

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Database connection with fallback logic
const connectDB = async () => {
  const primaryURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-assistant';
  const fallbackURI = 'mongodb://127.0.0.1:27017/interview-assistant';

  const tryConnect = async (uri, label) => {
    console.log(`Attempting MongoDB connection (${label}): ${uri}`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected (${label}): host=${conn.connection.host} db=${conn.connection.name}`);
    return conn;
  };

  try {
    try {
      await tryConnect(primaryURI, 'primary');
    } catch (primaryErr) {
      console.warn(`Primary MongoDB connection failed: ${primaryErr.message}`);
      if (primaryURI.includes('mongo') || primaryURI.includes('mongodb://mongo')) {
        console.log('Detected docker hostname "mongo" – attempting localhost fallback...');
      } else {
        console.log('Attempting localhost fallback...');
      }
      await tryConnect(fallbackURI, 'fallback');
    }
  } catch (finalErr) {
    console.error('❌ All MongoDB connection attempts failed. Exiting.');
    console.error(finalErr);
    process.exit(1);
  }
};

// Start server only after DB connection (or after fallback succeeds)
const startServer = async () => {
  await connectDB();
  if (!app.listening) {
    app.listen(PORT, () => {
      app.listening = true; // custom flag to avoid double start
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
    });
  }
};

startServer();

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/rounds', roundsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Interview Assistant API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

// (Removed immediate listen; handled in startServer())
