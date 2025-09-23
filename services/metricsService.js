/**
 * Basic in-memory metrics & aggregation
 * Replace with real DB queries in production.
 */
const metricsService = {
  async getOverview(db){
    // db placeholder. Replace with real models if available.
    // Returning stub counts to be replaced by DB queries.
    return {
      clinicsCount: 9,
      examsCount: 24,
      usersCount: 3,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    };
  },
  async getPrometheusMetrics(){
    const lines = [];
    lines.push('# HELP app_uptime_seconds Uptime of the Node.js process');
    lines.push('# TYPE app_uptime_seconds gauge');
    lines.push(`app_uptime_seconds ${process.uptime().toFixed(0)}`);
    lines.push('# HELP app_info Basic app info');
    lines.push('# TYPE app_info gauge');
    lines.push(`app_info{version="${process.env.APP_VERSION||"1.0.0"}"} 1`);
    return lines.join('\n');
  }
};

module.exports = metricsService;
