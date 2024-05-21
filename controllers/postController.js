const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("../config/passport");

//GET request for all posts
exports.post_list = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).sort({ date: 1 }).exec();

  res.json(posts);
});

//GET request for single post
exports.post_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate("user").exec();
  res.json(post);
});

//POST request to create single post
exports.post_create = asyncHandler(async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    author: req.body.author,
    comments: [],
    published: req.body.title,
    date: new Date(),
  });
  post.save();
  res.json(post);
});

//DELETE request to delete single post
exports.post_delete = asyncHandler(async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

//PUT request to update single post
exports.post_delete = asyncHandler(async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    author: req.body.author,
    comments: [],
    published: req.body.title,
    date: new Date(),
    _id: req.params.id,
  });
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, post, {});
  res.json(updatedPost);
});
