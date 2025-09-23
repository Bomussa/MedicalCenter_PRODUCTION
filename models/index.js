'use strict';
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../db/config')[env];

const sequelize = new Sequelize(config.url, { dialect: 'postgres', logging: config.logging });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models
db.User = require('./user')(sequelize, DataTypes);
db.Clinic = require('./clinic')(sequelize, DataTypes);
db.Exam = require('./exam')(sequelize, DataTypes);
db.Visit = require('./visit')(sequelize, DataTypes);

// Relations
db.Clinic.hasMany(db.Exam, { foreignKey: 'clinicId' });
db.Exam.belongsTo(db.Clinic, { foreignKey: 'clinicId' });

db.Clinic.hasMany(db.Visit, { foreignKey: 'clinicId' });
db.Visit.belongsTo(db.Clinic, { foreignKey: 'clinicId' });

db.User.hasMany(db.Visit, { foreignKey: 'userId' });
db.Visit.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;

// CMS models
db.AppConfig = require('./appConfig')(sequelize, DataTypes);
db.Text = require('./text')(sequelize, DataTypes);
db.Icon = require('./icon')(sequelize, DataTypes);
db.Page = require('./page')(sequelize, DataTypes);
db.Route = require('./route')(sequelize, DataTypes);

// Relations
db.Route.belongsTo(db.Page, { foreignKey: 'pageId' });
