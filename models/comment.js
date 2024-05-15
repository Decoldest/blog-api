const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true, maxLength: 500 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
