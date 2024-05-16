var express = require("express");
var router = express.Router();
const postController = require("../controllers/postController");

/* GET posts page. */
router.get("/", postController.post_list);

/* GET single post page. */
router.get("/:postId", postController.post_detail);


module.exports = router;
