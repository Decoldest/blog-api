const Comment = require("../models/comment");
const User = require("../models/user");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.comment_detail = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId)
    .populate("author")
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
    const author = await User.findOne({ username: req.user.username });

    if (!author) {
      return res.status(404).json({ message: "Comment author not found" });
    }

    const comment = new Comment({
      text: req.body.text,
      author: author._id,
      date: new Date(),
    });

    await comment.save();

    //Push comment onto correct comment comment array
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postID,
      {
        $push: { comments: comment._id },
      },
      { new: true },
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "Error updating non-existant post" });
    }

    res.json({ message: "New comment created", comment, updatedPost });
  }),
];

//DELETE request to delete single comment
exports.comment_delete = [
  asyncHandler(async (req, res, next) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.commentID);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      //Pull comment from a post comment array
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

//PUT request to update comment
exports.comment_update = [
  body("text")
    .isLength({ min: 1, max: 500 })
    .trim()
    .withMessage("Comment must be between 1-500 characters"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, postID } = req.body;
    const { commentID } = req.params;

    //Update comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentID,
      { text },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    //Push comment onto correct comment comment array
    const updatedPost = await Post.updateOne(
      {
        _id: postID,
        "comments._id": commentID,
      },
      { $set: { "comment.$.text": text } },
      { new: true },
    );

    res.json({ message: "Comment updated", updatedComment, updatedPost });
  }),
];
