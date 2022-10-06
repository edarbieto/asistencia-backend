const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
    return;
  });
  app.post(
    "/api/user/changenickname",
    [authJwt.verifyToken],
    controller.changeNickname
  );
  app.get(
    "/api/user/listusers",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.listUsers
  );
  app.delete(
    "/api/user",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );
  app.patch(
    "/api/user/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateRoles
  );
  app.patch(
    "/api/user/password",
    [authJwt.verifyToken],
    controller.updatePassword
  );
};
