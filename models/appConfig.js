module.exports = (sequelize, DataTypes) => {
  const AppConfig = sequelize.define('AppConfig', {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.JSONB }
  }, { tableName: 'app_config' });
  return AppConfig;
};
