const db = require("../models");
const User = db.user;
const Role = db.role;
const Attendance = db.attendance;

const Op = db.Sequelize.Op;

exports.register = async (req, res) => {
  try {
    // simple register. need to implement QR match authentication
    // filters
    const userId = req.userId;
    const startDate = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(new Date().setHours(23, 59, 59, 999));
    const { type, notes } = req.body;
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
    if (!["IN", "OUT"].includes(type)) {
      return res
        .status(400)
        .send({ message: "Registry type not valid. Only IN or OUT allowed" });
    }
    if (type === "IN" && sumAttendancesToday.includes("IN")) {
      return res
        .status(400)
        .send({ message: "Only one IN registry allowed per day" });
    }
    if (type === "OUT" && sumAttendancesToday.includes("OUT")) {
      return res
        .status(400)
        .send({ message: "Only one OUT registry allowed per day" });
    }
    if (type === "OUT" && !sumAttendancesToday.includes("IN")) {
      return res
        .status(400)
        .send({ message: "Can not register OUT without register IN first" });
    }
    // register attendance
    const newAttendance = await Attendance.create({
      type: type,
      notes: notes,
      userId: userId,
    });
    return res.status(200).send(newAttendance);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.getToday = async (req, res) => {
  try {
    // filters
    const userId = req.userId;
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

exports.userDayAttendance = async (req, res) => {
  try {
    // get userId
    const userId = req.userId;
    // get start and end dates
    const { year, month, day } = req.body;
    const startDate = new Date(new Date(year, month, day).setHours(0, 0, 0, 0));
    const endDate = new Date(
      new Date(year, month, day).setHours(23, 59, 59, 999)
    );
    // query
    const attendances = await Attendance.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: userId,
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
