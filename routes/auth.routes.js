const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET index page
router.get("/", isLoggedOut, (req, res) => {
  res.render("index");
});

// POST /auth/signup
router.post("/auth/signup", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body)

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("index", {
      errorMessage: "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  // This regular expression checks password for special characters and minimum length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render("index", {
      errorMessage:
        "Password needs to have at least 6 characters and one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => User.create({ username, email, password: hashedPassword }))
    .then((user) => {
      req.session.currentUser = user.toObject();
      delete req.session.currentUser.password;
      res.redirect("/start");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("/", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("/", {
          errorMessage: "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/auth/login", isLoggedOut, (req, res) => res.render("auth/login"));

// POST /auth/login
router.post("/auth/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage: "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .populate("family")
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res.status(400).render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            return res.status(400).render("auth/login", { errorMessage: "Wrong credentials." });
          }

          // Add the user object (minus password) to the session object
          req.session.currentUser = user.toObject();
          delete req.session.currentUser.password;

          // ISSUE! Need user to refer to family id
          user.family._id ? res.redirect(`/family/${user.family._id}`) : res.redirect("/start");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render("auth/logout", { errorMessage: err.message });
    }

    res.redirect("/");
  });
});

module.exports = router;