var express = require("express");
var router = express.Router();

/* GET posts page. */
router.get("/", function (req, res, next) {
  res.send("posts");
});

module.exports = router;
