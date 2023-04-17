require("dotenv").config();

const { BlacklistModel } = require("../models/blacklist.js");

const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const bl_token = await BlacklistModel.find({ token });
    if (bl_token.length > 0) {
      res.status(400).send({ msg: "please login again" });
    }
    const decoded = jwt.verify(token, process.env.JWT);
    if (decoded) {
      req.role = decoded.role;
      req.email = decoded.email;
      next();
    }
  } else {
    res.send("please login again");
  }
};

module.exports = {
  authenticate,
};
