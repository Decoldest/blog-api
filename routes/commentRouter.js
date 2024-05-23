var express = require("express");
var comments = express.Router();
const commentController = require("../controllers/commentController");
const passport = require("passport");

comments.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentController.comment_post,
);

module.exports = router;
