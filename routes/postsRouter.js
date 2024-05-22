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
  async (req, res, next) => {
    console.log(req.user._id);
    console.log(req.params.id);

    verifyIsPostAuthor(req, res, next);
  },
  // async (req, res, next) => {
  //   res.json({ messsage: "good" });
  // },
  postController.posts_update,
);

const mongoose = require("mongoose");

async function verifyIsPostAuthor(req, res, next) {
  const [userID, postID] = [req.user._id, req.params.id];
  try {
    //Check if id params is valid before querying database
    if (!mongoose.Types.ObjectId.isValid(postID))
      return res.status(404).json({ msg: `No task with id :${postID}` });

    const post = await Post.findById(postID);

    if (!post) {
      return res.status(404).json({ message: "No Post found" });
    }

    const authorID = post.author.toString(); // Ensure authorID is in string format

    if (userID.toString() === authorID) {
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error verifying post author:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = posts;
