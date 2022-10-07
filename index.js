const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin:
      process.env.ENVIRONMENT === "PROD"
        ? "http://localhost"
        : "http://localhost:5173",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(compression());

const bcrypt = require("bcrypt");
const db = require("./models");
const User = db.user;
const Role = db.role;

const initializeDB = async () => {
  try {
    await Role.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        name: "user",
      },
    });
    await Role.findOrCreate({
      where: { id: 2 },
      defaults: {
        id: 2,
        name: "admin",
      },
    });
    const planAdminPassword = process.env.ADMIN_PASSWORD || "admin";
    // hash admin password
    const hashedPassword = await bcrypt.hash(planAdminPassword, 8);
    await User.findOrCreate({
      where: { username: "admin" },
      defaults: {
        username: "admin",
        nickname: "admin",
        password: hashedPassword,
      },
    });
    const adminUser = await User.findOne({
      where: {
        username: "admin",
      },
    });
    await adminUser.setRoles([2]);
  } catch (err) {
    console.log(err.message);
    console.log("Fatal error");
  }
};

db.sequelize.sync().then(async () => {
  console.log("Initializing database model");
  await initializeDB();
});

require("./routes/auth.routes")(app);
require("./routes/attendance.routes")(app);
require("./routes/user.routes")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
