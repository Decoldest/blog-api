const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// ...

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { isAuthor } = req.body.isAuthor;
      try {
        const user = await User.create({ username, password, isAuthor });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);
