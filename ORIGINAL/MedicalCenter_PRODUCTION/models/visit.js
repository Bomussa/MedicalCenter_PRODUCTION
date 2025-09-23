module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    militaryIdEnc: DataTypes.TEXT,
    gender: DataTypes.STRING,
    examId: DataTypes.STRING,
    clinicId: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'queued' }, // queued|in_progress|done|skipped
    startTime: { type: DataTypes.DATE, allowNull: true },
    endTime: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'visits' });
  return Visit;
};
