var express = require("express");
var posts = express.Router();
const postController = require("../controllers/postController");
const passport = require("passport");
const User = require("../models/user");
const Post = require("../models/post");
const { authenticateJWT } = require("../config/passport");

/* GET posts page. */
posts.get("/", postController.posts_list);

/* GET single post page. */
posts.get("/:postID", postController.posts_detail);

posts.post("/", authenticateJWT, postController.posts_create);

posts.put(
  "/:postID",
  authenticateJWT,
  async (req, res, next) => {
    verifyIsPostAuthorOrAdmin(req, res, next);
  },
  postController.posts_update,
);

posts.delete(
  "/:postID",
  authenticateJWT,
  async (req, res, next) => {
    verifyIsPostAuthorOrAdmin(req, res, next);
  },
  postController.posts_delete,
);

posts.get(
  "/admin",
  authenticateJWT,
  async (req, res, next) => {
    const [userID] = [req.user._id];
    verifyIsAdmin(userID);
  },
  postController.posts_list_admin,
);

posts.post(
  "/admin/publish",
  authenticateJWT,
  async (req, res, next) => {
    const [userID] = [req.user._id];
    verifyIsAdmin(userID);
  },
  postController.posts_publish_admin,
);

const mongoose = require("mongoose");

//Check authorization for updating/deleting; calls next only if user is author or admin
async function verifyIsPostAuthorOrAdmin(req, res, next) {
  const [userID, postID] = [req.user._id, req.params.postID];

  if (!mongoose.Types.ObjectId.isValid(postID))
    return res.status(404).json({ msg: `No task with id :${postID}` });

  try {
    //Check if id params is valid before querying database

    const post = await Post.findById(postID);

    if (!post) {
      return res.status(404).json({ message: "No Post found" });
    }

    const authorID = post.author.toString();

    if (
      (await verifyIsAuthor(userID.toString(), authorID)) ||
      (await verifyIsAdmin(userID))
    ) {
      next(); //Authorized
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error verifying post author:", error);
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

module.exports = posts;
