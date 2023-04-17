const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { UserModel } = require("../models/usermodel");
const { authenticate } = require("../middleware/authenticate");
const { BlacklistModel } = require("../models/blacklist");

const { BlogModel } = require("../models/blogs.js");

require("dotenv").config();

const user_router = express.Router();

const authorise = (passed_role) => {
  return (req, res, next) => {
    if (passed_role == req.role) {
      next();
    } else {
      res.send("Unauthorize user");
    }
  };
};

user_router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await UserModel.find({ email });
  if (user.length > 0) {
    res.status(400).send({ msg: "User already exists" });
  }
  const hashedpass = bcrypt.hashSync(password, 8);
  const newuser = await UserModel({ name, email, password: hashedpass, role });
  newuser.save();
  res.send("signup successfull");
});

user_router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.find({ email });
  if (user.length > 0) {
    const ispassword = bcrypt.compareSync(password, user[0].password);
    if (ispassword) {
      const token = jwt.sign({ email, role: user[0].role }, process.env.JWT, {
        expiresIn: "1m",
      });

      const ref_token = jwt.sign(
        { email, role: user[0].role },
        process.env.JWT_REF,
        { expiresIn: "3m" }
      );
      res.send({ msg: "login successful", token, ref_token });
    } else {
      res.send("wrong credentials");
    }
  } else {
    res.send("wrong credentials");
  }
});

user_router.get("/logout", authenticate, async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    const blacklist = await BlacklistModel({ token });
    blacklist.save();
    res.send("logout successful");
  } else {
    res.send("please login first");
  }
});

user_router.get("/newtoken", async (req, res) => {
  const ref_token = req.headers.authorization;

  const decoded = jwt.verify(ref_token, process.env.JWT_REF);
  if (decoded) {
    const token = jwt.sign(
      { email: req.email, role: req.role },
      process.env.JWT,
      {
        expiresIn: "1m",
      }
    );
    res.send({ msg: "newtoken provided", new_token: token });
  } else {
    res.send("please login again");
  }
});

user_router.post(
  "/create",
  authenticate,
  authorise("User"),
  async (req, res) => {
    const email = req.email;
    const msg = req.body;
    const blogs = await BlogModel.find({ email });
    if (blogs.length > 0) {
      const umsg = blogs[0].blog_msg.push(msg);
      const ublog = await BlogModel.findOneAndUpdate(
        { email },
        { blog_msg: umsg }
      );
      res.send("blog is updated");
    } else {
      const newblog = await BlogModel({ email, blog_msg: [msg] });
      newblog.save();
      res.send("newblog is created");
    }
  }
);

user_router.get("/read", authenticate, authorise("User"), async (req, res) => {
  const email = req.email;
  const msg = req.body;
  const blogs = await BlogModel.find({ email });
  if (blogs.length > 0) {
    res.send(blogs[0].blog_msg);
  } else {
    res.send("something went wrong");
  }
});

user_router.delete(
  "/delete",
  authenticate,
  authorise("User"),
  async (req, res) => {
    const email = req.email;
    const blogs = await BlogModel.findOneAndDelete({ email });
    res.send("blog is deleted");
  }
);

user_router.delete(
  "/moderator/delete/:id",
  authenticate,
  authorise("Moderator"),
  async (req, res) => {
    const ID = req.params.id;
    const blogs = await BlogModel.findByIdAndDelete({ _id: ID });
    res.send("blog is deleted");
  }
);

module.exports = {
  user_router,
};
