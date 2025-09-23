module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    path: { type: DataTypes.STRING, primaryKey: true }, // e.g., /start, /exam
    pageId: { type: DataTypes.STRING },                 // maps to Page.id
    roles: { type: DataTypes.ARRAY(DataTypes.STRING) }  // allowed roles
  }, { tableName: 'routes' });
  return Route;
};
