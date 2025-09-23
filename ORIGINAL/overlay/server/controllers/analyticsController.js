const metricsService = require('../services/metricsService');

exports.getOverview = async (req, res, next) => {
  try {
    const data = await metricsService.getOverview(req.db);
    res.json(data);
  } catch (e) { next(e); }
};

exports.getMetrics = async (req, res, next) => {
  try {
    const text = await metricsService.getPrometheusMetrics();
    res.set('Content-Type', 'text/plain').status(200).send(text);
  } catch (e) { next(e); }
};
