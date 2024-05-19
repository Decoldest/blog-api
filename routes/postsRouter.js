var express = require("express");
var posts = express.Router();
const postController = require("../controllers/postController");

/* GET posts page. */
posts.get("/", postController.post_list);

/* GET single post page. */
posts.get("/:postId", postController.post_detail);

module.exports = posts;
