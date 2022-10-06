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
  app.post("/api/attendance", [authJwt.verifyToken], controller.register);
  app.get("/api/attendance/today", [authJwt.verifyToken], controller.getToday);
  app.post(
    "/api/attendance/userdayattendance",
    [authJwt.verifyToken],
    controller.userDayAttendance
  );
  app.post(
    "/api/attendance/dayreport",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.dayReport
  );
};
