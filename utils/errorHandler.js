const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err);
  const status = err.status || 500;
  const message = status === 500 ? 'Server error' : err.message;
  res.status(status).json({ message });
};

module.exports = errorHandler;
