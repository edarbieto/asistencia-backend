const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

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
    "/api/auth/signup",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.checkUsernameAvailability,
    ],
    controller.signUp
  );
  app.post("/api/auth/signin", controller.signIn);
};
