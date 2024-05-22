var express = require("express");
var posts = express.Router();
const postController = require("../controllers/postController");
const passport = require("passport");
const User = require("../models/user");
const Post = require("../models/post");

/* GET posts page. */
posts.get("/", postController.posts_list);

/* GET single post page. */
posts.get("/:postId", postController.posts_detail);

posts.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.posts_create,
);

posts.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  verifyIsPostAuthor(req.user._id, req.params.id),
  postController.posts_update,
);

async function verifyIsPostAuthor(userID, postId) {
  const post = await Post.findById(postId);

  if (!post) {
    return new Error("No Post");
  }

  const authorID = post.author;
  console.log(userID);
  console.log(authorID);
  next();
}

module.exports = posts;
