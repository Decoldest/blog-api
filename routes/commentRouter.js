var express = require("express");
var comments = express.Router();
const commentController = require("../controllers/commentController");
const passport = require("passport");
const Comment = require("../models/comment");

comments.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentController.comment_post,
);

comments.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    verifyIsCommentAuthorOrAdmin(req, res, next);
  },
  commentController.comment_delete,
);

comments.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    verifyIsCommentAuthorOrAdmin(req, res, next);
  },
  commentController.comment_update,
);

const mongoose = require("mongoose");
//Check authorization for updating/deleting; calls next only if user is author or admin
async function verifyIsCommentAuthorOrAdmin(req, res, next) {
  const [userID, commentID] = [req.user._id, req.params.id];

  if (!mongoose.Types.ObjectId.isValid(commentID))
    return res.status(404).json({ msg: `No task with id :${commentID}` });

  try {
    //Check if id params is valid before querying database

    const comment = await Comment.findById(commentID);

    if (!comment) {
      return res.status(404).json({ message: "No Comment found" });
    }

    const authorID = comment.author.toString();

    if (
      (await verifyIsAuthor(userID.toString(), authorID)) ||
      (await verifyIsAdmin())
    ) {
      next(); //Authorized
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error verifying comment author:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function verifyIsAuthor(userID, authorID) {
  return userID === authorID;
}

async function verifyIsAdmin(userID) {
  const user = await User.findById(userID);
  return user.isAdmin;
}

module.exports = comments;
