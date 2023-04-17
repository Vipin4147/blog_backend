const mongoose = require("mongoose");

const BlacklistSchema = mongoose.Schema({
  token: String,
});

const BlacklistModel = mongoose.model("blacklists", BlacklistSchema);

module.exports = {
  BlacklistModel,
};
