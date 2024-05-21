var express = require("express");
var router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { verifyToken } = require("../config/passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express=" });
});

router.post("/test", (req, res) => {
  res.send("Test route working!");
});

router.post("/sign-up", (req, res, next) => {
  passport.authenticate("sign-up", (err, user, info) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Something went wrong", error: err });
    }
    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }
    res.status(201).json({ message: "User created successfully", user });
  })(req, res, next);
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: "Authentication failed", info });
    }
    req.login(user, { session: false }, (error) => {
      if (error) return error;

      const body = { _id: user._id, username: user.username };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ token });
    });
  })(req, res, next);
});

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.status(200).send("protected");
  },
  (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Handle other errors if needed
    next(err);
  },
);

module.exports = router;
