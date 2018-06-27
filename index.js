require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const students = require("./students.json");

const strategy = require("./strategy.js");
// const Auth0Strategy = require("passport-auth0");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000000
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(strategy);

passport.serializeUser((user, done) => {
  return done(null, {
    clientID: user.id,
    email: user._json.email,
    name: user._json.name
  });
});

passport.deserializeUser((obj, done) => {
  return done(null, obj);
});

app.get(
  "/login",
  passport.authenticate("auth0", {
    successRedirect: "/students",
    failureRedirect: "/login",
    connection: "github"
  })
);

authenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.get("/students", authenticated, (req, res, next) => {
  res.status(200).send(students);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Ssserver listening on port ${port}`);
});
