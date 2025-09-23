module.exports = (sequelize, DataTypes) => {
  const Text = sequelize.define('Text', {
    key: { type: DataTypes.STRING, primaryKey: true },
    ar: { type: DataTypes.TEXT },
    en: { type: DataTypes.TEXT }
  }, { tableName: 'texts' });
  return Text;
};
