const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//GET request for all posts
exports.posts_list = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).sort({ date: 1 }).exec();

  res.json(posts);
});

//GET request for single post
exports.posts_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate("user").exec();
  res.json(post);
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
        published: false,
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
      
      await Post.findByIdAndDelete(req.params.id);
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

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, text } = req.body;
      const { id } = req.params;

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { title, text },
        {
          new: true,
          runValidators: true,
        },
      );

      res.json({ message: "Updated post", updatedPost });
    } catch (error) {
      res.status(500).json({ message: "Error updating post", error });
    }
  }),
];
