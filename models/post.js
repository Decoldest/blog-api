const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 2000 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  comments: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  published: { type: Boolean },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Post", postSchema);
