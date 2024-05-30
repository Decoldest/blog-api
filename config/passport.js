require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

passport.use(
  "sign-up",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { isAdmin } = req.body;
      try {
        const checkUser = await User.findOne({ username: username });
        if (checkUser) {
          return done(null, false, { message: "Username taken" });
        }
        const user = await User.create({ username, password, isAdmin });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

// ...

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user, { message: "Login sucessful" });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        if (!token.user) {
          return done(null, false, { message: "Unauthorized" });
        }

        return done(null, token.user); // Authorized
      } catch (error) {
        done(error);
      }
    },
  ),
);

module.exports.authenticateJWT = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
