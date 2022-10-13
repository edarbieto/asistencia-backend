const { authJwt } = require("../middlewares");
const controller = require("../controllers/attendance.controller");

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
    "/api/attendance",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.register
  );
  app.get(
    "/api/attendance/today",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.today
  );
  app.get(
    "/api/attendance/todayUsers",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.todayUsers
  );
};
