module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('Page', {
    id: { type: DataTypes.STRING, primaryKey: true },
    title_ar: DataTypes.STRING,
    title_en: DataTypes.STRING,
    layout: DataTypes.JSONB         // array of blocks/components
  }, { tableName: 'pages' });
  return Page;
};
