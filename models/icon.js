module.exports = (sequelize, DataTypes) => {
  const Icon = sequelize.define('Icon', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    svg: { type: DataTypes.TEXT },   // inline SVG string
    url: { type: DataTypes.TEXT }    // or remote/local path
  }, { tableName: 'icons' });
  return Icon;
};
