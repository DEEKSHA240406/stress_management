// server.js - Main Express Server
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========

// CORS Configuration - Allow all origins in development
app.use(cors({
  origin: '*', // In production, specify your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'] ? 'Bearer ***' : 'none'
    }
  });
  next();
});

// ========== ROUTES ==========

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mental Wellness API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      documentation: 'GET /api/docs',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        verify: 'GET /api/auth/verify',
        logout: 'POST /api/auth/logout',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'POST /api/auth/reset-password'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    api: 'Mental Wellness API',
    version: '1.0.0',
    baseUrl: `http://localhost:${PORT}/api`,
    authentication: 'JWT Bearer Token',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user',
        body: {
          name: 'string (required)',
          email: 'string (required)',
          password: 'string (required, min 6 chars)',
          role: 'string (optional, default: student)'
        }
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login user',
        body: {
          email: 'string (required)',
          password: 'string (required)'
        }
      },
      {
        method: 'GET',
        path: '/api/auth/verify',
        description: 'Verify JWT token',
        headers: {
          Authorization: 'Bearer <token>'
        }
      }
    ]
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// ========== ERROR HANDLING ==========

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      error: error 
    })
  });
});

// ========== START SERVER ==========

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 MENTAL WELLNESS API SERVER');
  console.log('='.repeat(60));
  console.log(`📡 Server Status: Running`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('\n🔗 Access URLs:');
  console.log(`   Local:           http://localhost:${PORT}`);
  console.log(`   Network:         http://<your-ip>:${PORT}`);
  console.log(`   Health Check:    http://localhost:${PORT}/api/health`);
  console.log(`   Documentation:   http://localhost:${PORT}/api/docs`);
  console.log('\n📱 React Native Connection:');
  console.log(`   iOS Simulator:      http://localhost:${PORT}/api`);
  console.log(`   Android Emulator:   http://10.0.2.2:${PORT}/api`);
  console.log(`   Physical Device:    http://<your-ip>:${PORT}/api`);
  console.log('\n👤 Test Users:');
  console.log('   Student: student@test.com / password123');
  console.log('   Admin:   admin@test.com / admin123');
  console.log('='.repeat(60) + '\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;