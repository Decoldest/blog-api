var express = require("express");
var router = express.Router();
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post(
  "sign-up",
  passport.authenticate("signup", { session: false }),
  async function (req, res, next) {
    res.json({ message: "Sign up sucessful", user: req.user });
  },
);

module.exports = router;
