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
import subjectsRoutes from './routes/subjects.js';

// Native modules for file path handling in ES modules
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

// Database connection to MongoDB Atlas only
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in environment variables!');
    console.error('   Please check your backend/.env file');
    throw new Error('Missing MONGODB_URI environment variable');
  }

  try {
    console.log(`🔗 Connecting to MongoDB Atlas...`);
    console.log(`   URI: ${mongoURI.substring(0, 50)}...`);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready to accept requests!\n`);

    return conn;
  } catch (error) {
    console.error('\n❌ MongoDB Atlas Connection FAILED!');
    console.error('━'.repeat(60));
    console.error(`Error Message: ${error.message}`);
    console.error('━'.repeat(60));

    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Possible causes:');
      console.error('   - Check your cluster URL in MONGODB_URI');
      console.error('   - Verify internet connection');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Possible causes:');
      console.error('   - Wrong username or password');
      console.error('   - Check database user credentials in MongoDB Atlas');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('💡 Possible causes:');
      console.error('   - IP address not whitelisted in MongoDB Atlas');
      console.error('   - Go to Network Access and add 0.0.0.0/0');
    }

    console.error('\n🛑 Application cannot start without database connection');
    console.error('   Please fix the issue and try again.\n');

    throw error; // Re-throw to stop the application
  }
};

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/rounds', roundsRoutes);
app.use('/api/subjects', subjectsRoutes);

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
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../dist')));

  // Any route that is not an API route will be handled by the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
} else {
  // 404 handler for development (or valid API 404s)
  app.use('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: `Route ${req.originalUrl} not found`
    });
  });
}


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
