const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  email: String,
  blog_msg: Array,
});

const BlogModel = mongoose.model("blogs", BlogSchema);

module.exports = {
  BlogModel,
};
