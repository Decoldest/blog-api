const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true, maxLength: 100 },
  password: { type: String, required: true, minLength: 5 },
  isAuthor: { type: Boolean, required: true },
});

userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (err) {
    return next(err);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
