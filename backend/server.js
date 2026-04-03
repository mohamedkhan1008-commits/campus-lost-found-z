// Campus Lost & Found Web Portal
// Main Express Server
// This is the entry point of the backend application

require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');

// Initialize Express application
const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Enable CORS for all routes (allow frontend to communicate with backend)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================

// Connect to MySQL database
connectDB().catch(err => {
  console.error('Database initialization failed', err);
  console.error('🚨 Ensure MySQL is running and your .env has correct DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.');
  console.error('🚨 For quick local testing, run: mysql -u root -p (or start your MySQL service).');
  process.exit(1);
});

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Campus Lost & Found API is running' 
  });
});

// Authentication routes (signup, login, logout, verify)
app.use('/api/auth', authRoutes);

// Items routes (create, read, update, delete items)
app.use('/api/items', itemRoutes);

// Users routes (dashboard, profile)
app.use('/api/users', userRoutes);

// ============================================
// STATIC FILE SERVING
// ============================================

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Catch-all handler: send back index.html for any non-API routes (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// 404 - Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  Campus Lost & Found Portal - Backend      ║
║  Server running on http://localhost:${PORT}    ║
║  Environment: ${process.env.NODE_ENV || 'development'}                ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
