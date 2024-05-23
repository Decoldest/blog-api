const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true, minLength:1, maxLength: 500 },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: "Anonymous",
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
