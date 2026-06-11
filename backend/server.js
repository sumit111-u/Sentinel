import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import githubRoutes from './routes/github.js';
import reviewsRoutes from './routes/reviews.js';
import usersRoutes from './routes/users.js';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Request logging (optional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sentinel API',
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/github', githubRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/users', usersRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    detail: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    detail: 'Not found',
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Create tables if they don't exist
    // (Prisma migrations would be used in production)

    // Start listening
    app.listen(config.port, () => {
      console.log(`🚀 Sentinel API running on http://localhost:${config.port}`);
      console.log(`📚 Frontend URL: ${config.frontendUrl}`);
      console.log(`🔐 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export default app;
