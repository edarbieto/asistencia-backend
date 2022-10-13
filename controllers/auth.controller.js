const db = require("../models");
const config = require("../config/auth.config.js");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const userCreatedResponse = { message: "User created" };

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signIn = async (req, res) => {
  try {
    // login
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: "1h" });
    const roles = await user.getRoles();
    if (!roles.map((role) => role.name).includes("admin")) {
      return res.status(403).send({ message: "Require Administrator role." });
    }
    return res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .send({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        roles: roles.map((role) => role.name),
        token: token,
      });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    // create user
    const user = await User.create({
      username: req.body.username,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    if (req.body.roles && req.body.roles.length > 0) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.in]: req.body.roles,
          },
        },
      });
      // set requested roles
      await user.setRoles(roles);
      return res.status(200).send(userCreatedResponse);
    } else {
      // set default Employee role
      await user.setRoles([1]);
      return res.status(200).send(userCreatedResponse);
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
