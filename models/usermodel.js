const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, default: "User", enum: ["User", "Moderator"] },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = {
  UserModel,
};
