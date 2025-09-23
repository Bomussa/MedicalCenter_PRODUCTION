const mongoose = require('mongoose');
const logger = require('../config/logger');

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error: %s', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
