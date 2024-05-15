const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, minLength: 5 },
  isAuthor: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);
