const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkUsernameAvailability = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (user) {
      return res.status(400).send({ message: "Username already in use" });
    }
    next();
    return;
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const verifySignUp = {
  checkUsernameAvailability: checkUsernameAvailability,
};

module.exports = verifySignUp;
