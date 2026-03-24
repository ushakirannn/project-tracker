const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const connectDB = require('./config/db');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Import passport config
require('./config/passport');

const app = express();

// Middleware
app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/sprints', require('./routes/sprints'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/releases', require('./routes/releases'));
app.use('/api/discussions', require('./routes/discussions'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/search', require('./routes/search'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/roadmap', require('./routes/roadmap'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();

module.exports = app;
