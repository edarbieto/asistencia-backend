const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const notLoggedInResponse = {
  message: "Not logged. Please log in.",
};

const notAdminResponse = {
  message: "Require Administrator role.",
};

const verifyToken = (req, res, next) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(403).send(notLoggedInResponse);
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send(notLoggedInResponse);
    }
    req.userId = decoded.id;
    next();
    return;
  });
};

const isAdministrator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    for (const role of roles) {
      if (role.name === "admin") {
        next();
        return;
      }
    }
    return res.status(403).send(notAdminResponse);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdministrator,
};

module.exports = authJwt;
