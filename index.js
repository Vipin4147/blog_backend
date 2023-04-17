const express = require("express");

const { Connection } = require("./config/db.js");

const { UserModel } = require("./models/usermodel.js");

const { user_router } = require("./routes/user_router.js");

const { authenticate } = require("./middleware/authenticate.js");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is home page");
});

app.use("/user", user_router);

app.listen(6200, async () => {
  await Connection;
  console.log("connected to db");
  console.log("running at 6200");
});
