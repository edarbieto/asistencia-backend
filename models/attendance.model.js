module.exports = (sequelize, Sequelize) => {
  const Attendance = sequelize.define("attendance", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING,
    },
    onTime: {
      type: Sequelize.BOOLEAN,
    },
    notes: {
      type: Sequelize.STRING,
    },
  });

  return Attendance;
};
