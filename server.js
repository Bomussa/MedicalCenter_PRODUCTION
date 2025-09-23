const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("./utils/logger");

dotenv.config();

const createServer = () => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: function (origin, callback) {
      const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }));
  app.use(express.json());

  // Routes
  const userRoutes = require("./routes/users");
  const clinicRoutes = require("./routes/clinics");
  const examRoutes = require("./routes/exams");
  const analyticsRoutes = require("./routes/analytics");
  const cmsRoutes = require("./routes/cms");
  const visitsRoutes = require("./routes/visits");

  app.use("/api/users", userRoutes);
  app.use("/api/clinics", clinicRoutes);
  app.use("/api/exams", examRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/cms", cmsRoutes);
  app.use("/api/visits", visitsRoutes);

  // Additional routes (voice prompts and clinic redirects)
  // Load these inside createServer so 'app' is in scope. Catch errors to avoid crashing if modules are missing.
  try {
    app.use('/api/voice-prompts', require('./routes/voicePrompts'));
  } catch (e) {
    logger.error('voicePrompts route error', e.message);
  }
  try {
    app.use('/api/clinic-redirects', require('./routes/clinicRedirects'));
  } catch (e) {
    logger.error('clinicRedirects route error', e.message);
  }

  app.get("/", (req, res) => {
    res.send("AttarMedical Backend API");
  });

  // Health check
  app.get('/api/health', (req, res) => res.status(200).json({ ok: true }));

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack, path: req.path, method: req.method, ip: req.ip });
    res.status(err.statusCode || 500).json({
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  });

  return app;
};
// Connect to MongoDB function
const connectDB = async (options = {}) => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, { ...options, useNewUrlParser: true, useUnifiedTopology: true });
// removed: // removed:     console.log("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  const app = createServer();
  connectDB();
  const PORT = process.env.PORT || 5000;
// removed: // removed:   app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = { createServer, connectDB };
