const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.comment_detail = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId)
    .populate("user")
    .exec();
  res.json(comment);
});

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

    //Push comment onto correct post comment array
    const updatedPost = await Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: comment._id },
    });

    res.json({ message: "New comment created", comment, updatedPost });
  }),
];
