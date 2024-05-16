const Post = require("../models/post");
const asyncHandler = require("express-async-handler");

const posts = {
  test: "sdfd",
  tried: "fdfd",
};

//GET request for all posts
exports.post_list = asyncHandler(async (req, res, next) => {
  // const posts = await Post.find({}).sort({ date: 1 }).exec();

  res.json(posts);
});

//GET request for single post
exports.post_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate("user").exec();
  res.json(post);
});
