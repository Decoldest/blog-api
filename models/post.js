const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true, minLength: 1, maxLength: 100 },
  text: { type: String, required: true, minLength: 1, maxLength: 2000 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: false },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment", required: true }],
  published: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
