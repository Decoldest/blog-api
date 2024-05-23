const Comment = require("../models/comment");
const User = require("../models/user");
const Post = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.comment_detail = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId)
    .populate("user")
    .exec();
  res.json(comment);
});

//POST request to create single comment
exports.comment_post = [
  body("text")
    .isLength({ min: 1, max: 500 })
    .trim()
    .withMessage("Comment must be between 1-500 characters"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = new Comment({
      text: req.body.text,
      username: req.body.username,
      date: new Date(),
    });

    await comment.save();

    //Push comment onto correct comment comment array
    const updatedPost = await Post.findByIdAndUpdate(req.body.postID, {
      $push: { comments: comment._id },
    });

    res.json({ message: "New comment created", comment, updatedPost });
  }),
];

//DELETE request to delete single comment
exports.comment_delete = [
  asyncHandler(async (req, res, next) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      //Pop comment from comment array
      const updatedPost = await Post.findByIdAndUpdate(
        req.body.postID,
        {
          $pull: { comments: comment._id },
        },
        { new: true },
      );
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({ message: "Comment Deleted", comment, updatedPost });
    } catch (error) {
      next(error);
    }
  }),
];


