module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
    id: { type: DataTypes.STRING, primaryKey: true },
    title_ar: DataTypes.STRING,
    title_en: DataTypes.STRING,
    clinicId: { type: DataTypes.STRING }
  }, { tableName: 'exams' });
  return Exam;
};
