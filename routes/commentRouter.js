var express = require("express");
var comments = express.Router();
const commentController = require("../controllers/commentController");
const passport = require("passport");
const Comment = require("../models/comment");
const User = require("../models/user");
const { authenticateJWT } = require("../config/passport");

comments.post("/", authenticateJWT, commentController.comment_post);

comments.delete(
  "/:commentID",
  authenticateJWT,
  async (req, res, next) => {
    verifyIsCommentAuthorOrAdmin(req, res, next);
  },
  commentController.comment_delete,
);

comments.put(
  "/:commentID",
  authenticateJWT,
  async (req, res, next) => {
    try {
      verifyIsCommentAuthorOrAdmin(req, res, next);
    } catch (error) {
      console.error("Error updating comment:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  },
  commentController.comment_update,
);

const mongoose = require("mongoose");
//Check authorization for updating/deleting; calls next only if user is author or admin
async function verifyIsCommentAuthorOrAdmin(req, res, next) {
  const [userID, commentID] = [req.user._id, req.params.commentID];

  if (!mongoose.Types.ObjectId.isValid(commentID))
    return res.status(404).json({ msg: `No task with id :${commentID}` });

  try {
    //Check if commentID param is valid before querying database

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
      return res.status(403).json({ message: "Unauthorized request" });
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
