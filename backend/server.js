import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Route imports
import questionRoutes from './routes/questions.js';
import tagRoutes from './routes/tags.js';
import statsRoutes from './routes/stats.js';
import roundsRoutes from './routes/rounds.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import { authRequired } from './middleware/auth.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const app = express();
const BASE_PORT = parseInt(process.env.PORT, 10) || 5000;
let currentPort = BASE_PORT;

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

// (Removed morgan logging to reduce dependencies; lightweight console logging can be added if needed)

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

// Routes
app.use('/api/auth', authRoutes);
// protected API
app.use('/api/questions', authRequired, questionRoutes);
app.use('/api/tags', authRequired, tagRoutes);
app.use('/api/stats', authRequired, statsRoutes);
app.use('/api/rounds', authRequired, roundsRoutes);
app.use('/api/admin', adminRoutes);

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

// Start server only after DB connection (or after fallback succeeds)
async function startServer(retries = 5) {
  await connectDB();
  // Bootstrap default admin if no users exist
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'change-me-now';
  let admin = await User.findOne({ email });
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await User.create({ name: 'Admin', email, passwordHash, role: 'admin', status: 'active' });
    console.log(`👑 Default admin created -> email: ${email} password: ${password}`);
  }
  // Backfill user for existing docs without user
  try {
    const { default: Question } = await import('./models/Question.js');
    const { default: Tag } = await import('./models/Tag.js');
    const { default: Round } = await import('./models/Round.js');
    await Question.updateMany({ $or: [{ user: { $exists: false } }, { user: null }] }, { $set: { user: admin._id } });
    await Tag.updateMany({ $or: [{ user: { $exists: false } }, { user: null }] }, { $set: { user: admin._id } });
    await Round.updateMany({ $or: [{ user: { $exists: false } }, { user: null }] }, { $set: { user: admin._id } });
  } catch (e) {
    console.warn('Backfill warning:', e.message);
  }
  if (app.listening) return; // already started
  const attempt = () => new Promise((resolve, reject) => {
    const server = app.listen(currentPort, () => {
      app.listening = true;
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${currentPort}`);
      console.log(`📊 Health: http://localhost:${currentPort}/api/health`);
      resolve();
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        if (retries > 0) {
          console.warn(`Port ${currentPort} in use. Trying next port...`);
          currentPort += 1;
          setTimeout(() => startServer(retries - 1).then(resolve).catch(reject), 300);
        } else {
          reject(new Error(`No available ports after retries starting at ${BASE_PORT}`));
        }
      } else {
        reject(err);
      }
    });
  });
  return attempt();
}

startServer().catch(err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed.');
    }
  } catch (err) {
    console.error('Error during disconnect:', err.message);
  } finally {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// (Removed immediate listen; handled in startServer())
