const db = require("../models");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");

exports.updatePassword = async (req, res) => {
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const currentUser = await User.findByPk(req.userId);
    const currentRoles = (await currentUser.getRoles()).map((role) => role.name);
    if (!currentRoles.includes("admin") && req.body.userId) {
      return res
        .status(403)
        .send({ message: "Not admin. Can not change others password" });
    }
    // update user password
    const userId = req.body.userId || req.userId;
    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    return res.status(200).send({ message: "Password updated" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.updateRoles = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findOne({ where: { id: userId } });
    const newRoles = await Role.findAll({
      where: {
        name: {
          [Op.or]: req.body.roles,
        },
      },
    });
    await user.setRoles(newRoles);
    return res.status(200).send({ message: "Roles updated" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.changeNickname = async (req, res) => {
  try {
    // update user nickname
    const userId = req.userId;
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    return res.status(200).send({ message: "Nickname updated" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const users = await User.findAll({
      attributes: ["id", "username", "nickname"],
      include: Role,
      where: {
        id: {
          [Op.ne]: userId,
        },
      },
    });
    return res.status(200).send({ users: users });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findOne({ where: { id: userId } });
    await user.destroy();
    return res.status(200).send({ message: "User deleted" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
