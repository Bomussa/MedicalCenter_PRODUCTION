const mongoose = require('mongoose');

/**
 * Validate a MongoDB ObjectId present in req.params (default: "id").
 * Returns 400 if invalid.
 */
module.exports = (param = 'id') => (req, res, next) => {
  const val = req.params[param];
  if (!mongoose.Types.ObjectId.isValid(val)) {
    return res.status(400).json({ message: `Invalid ${param}` });
  }
  next();
};
