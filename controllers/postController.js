const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//GET request for all posts
exports.posts_list = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ published: true })
    .select("title text author date category")
    .populate("author")
    .sort({ date: 1 })
    .exec();
  res.json(posts);
});

//GET request for single post
exports.posts_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postID).populate("author").exec();
  const comments = await Comment.find({ _id: { $in: post.comments } }).populate(
    "author",
  );
  res.json({ post, comments });
});

//POST request to create single post
exports.posts_create = [
  //Validate length of title and text
  body("title")
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage("Title must be between 1-100 characters"),
  body("text")
    .isLength({ min: 1, max: 2000 })
    .trim()
    .withMessage("Text must be between 1-2000 characters"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    //req.body invalid
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Create and save post or handle errors
    try {
      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        author: req.body.author,
        comments: [],
        published: req.body.published,
        category: req.body.category,
        date: new Date(),
      });

      await post.save();
      res.json({ message: "Post created", post });
    } catch (error) {
      res.status(500).json({ message: "Error creating post", error });
    }
  }),
];

//DELETE request to delete single post
exports.posts_delete = [
  asyncHandler(async (req, res, next) => {
    try {
      //Delete post
      const post = await Post.findByIdAndDelete(req.params.postID);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      //Delete all comments from post
      await Comment.deleteMany({ _id: { $in: post.comments } });

      res.json({ message: "Post Deleted" });
    } catch (error) {
      next(error);
    }
  }),
];

//PUT request to update single post
exports.posts_update = [
  //Validate length of title and text
  body("title")
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage("Title must be between 1-100 characters"),
  body("text")
    .isLength({ min: 1, max: 2000 })
    .trim()
    .withMessage("Text must be between 1-2000 characters"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    //req.body invalid
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, text } = req.body;
      const { postID } = req.params;

      const updatedPost = await Post.findByIdAndUpdate(
        postID,
        { title, text },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({ message: "Updated post", updatedPost });
    } catch (error) {
      res.status(500).json({ message: "Error updating post", error });
    }
  }),
];

//For admin posts, include unpublished
exports.posts_list_admin = asyncHandler(async (req, res, next) => {
  const posts = await Post.find()
    .select("title text author date category")
    .populate("author")
    .sort({ date: 1 })
    .exec();
  res.json(posts);
});

//Allow admin to publish post
exports.posts_publish_admin = asyncHandler(async (req, res, next) => {
  try {
    const { published } = req.body;
    const { postID } = req.params;

    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      { published },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Published post", updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Error Publishing post", error });
  }
});
