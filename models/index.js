const config = require("../config/db.config.js");

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(config.DATABASE_URI, {
  dialect: config.dialect,
  operatorAliases: false,
  pool: config.pool,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.attendance = require("../models/attendance.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  other: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  other: "roleId",
});

db.user.hasMany(db.attendance, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

db.attendance.belongsTo(db.user);

db.ROLES = ["employee", "administrator"];

module.exports = db;
