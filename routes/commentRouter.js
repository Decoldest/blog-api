var express = require("express");
var router = express.Router();
const commentController = require("../controllers/commentController");

/* GET comments page. */
router.get("/", commentController.comment_list);

/* GET single comment page. */
router.get("/:commentId", commentController.comment_detail);

module.exports = router;
