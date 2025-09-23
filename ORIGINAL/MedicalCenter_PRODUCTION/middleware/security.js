const cors = require('cors');
const helmet = require('helmet');
module.exports = (app) => {
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: true, credentials: true }));
};
