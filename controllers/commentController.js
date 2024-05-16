const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");

const comments = {
  test: "sdfd",
  tried: "fdfd",
};

//GET request for all comments
exports.comment_list = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({}).sort({ date: 1 }).exec();

  res.json(comments);
});

exports.comment_detail = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).populate("user").exec();
  res.json(comment);
});
