module.exports = (sequelize, DataTypes) => {
  const Clinic = sequelize.define('Clinic', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name_ar: DataTypes.STRING,
    name_en: DataTypes.STRING,
    floor: DataTypes.STRING,
    requiresPIN: { type: DataTypes.BOOLEAN, defaultValue: false },
    pinCode: DataTypes.STRING
  }, { tableName: 'clinics' });
  return Clinic;
};
