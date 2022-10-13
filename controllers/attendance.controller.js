const db = require("../models");
const User = db.user;
const Role = db.role;
const Attendance = db.attendance;

const Op = db.Sequelize.Op;

exports.register = async (req, res) => {
  try {
    // simple register. need to implement QR match authentication
    // filters
    const userId = req.body.userId || req.userId;
    const startDate = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(new Date().setHours(23, 59, 59, 999));
    // query
    const attendances = await Attendance.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: userId,
      },
    });
    const sumAttendancesToday = attendances.map((attnd) => attnd.type);
    // validations
    if (sumAttendancesToday.length === 2) {
      return res.status(400).send({ message: "One two registries per day" });
    }
    // determine the registry type
    const type = sumAttendancesToday.length === 0 ? "IN" : "OUT";
    const maxInDate = new Date(new Date().setHours(9, 10, 0, 0));
    const minOutDate = new Date(new Date().setHours(17, 0, 0, 0));
    const onTime =
      type === "IN" ? new Date() <= maxInDate : new Date() >= minOutDate;
    // register attendance
    const newAttendance = await Attendance.create({
      type: type,
      onTime: onTime,
      userId: userId,
    });
    return res.status(200).send(newAttendance);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.today = async (req, res) => {
  try {
    // filters
    const userId = req.body.userId || req.userId;
    const startDate = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(new Date().setHours(23, 59, 59, 999));
    // query
    const attendances = await Attendance.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: userId,
      },
    });
    const sumAttendancesToday = attendances.map((attnd) => attnd.type);
    return res.status(200).send(sumAttendancesToday);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.todayUsers = async (req, res) => {
  try {
    // get start and end dates
    const startDate = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(new Date().setHours(23, 59, 59, 999));
    // query
    const attendances = await Attendance.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    return res.status(200).send(attendances);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.dayReport = async (req, res) => {
  try {
    // get start and end dates
    const { year, month, day } = req.body;
    const startDate = new Date(year, month, day).setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, day).setHours(24, 0, 0, 0);
    // query
    const attendances = await Attendance.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    return res.status(200).send(attendances);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
