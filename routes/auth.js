const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const duplicateKeyErrorCode = 11000;

const errors = require("../utils/errors");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Require needed models in order to use the database functions
const User = require("../models/User");

// Require needed middleware to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET index page
router.get("/", isLoggedOut, (req, res) => res.render("index"));

// POST /auth/signup
router.post("/auth/signup", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  // Although these fields are required in the HTML form, we still need to check here
  // in case the user manipulates the HTML and removes the required attribute
  if (username === "" || email === "" || password === "") {
    return res.status(400).render("index", errors.mandatorySignupFieldsMissing);
  }

  // Validate uniqueness of username and email
  User.findOne({ username }).then((user) => {
    if (user) {
      return res.status(400).render("index", errors.duplicateUsername);
    }
  });

  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).render("index", errors.duplicateEmail);
    }
  });

  // This regular expression checks password for special characters and minimum length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    return res.status(400).render("index", errors.weakPassword);
  }

  // Create a new user in the database
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
        res.status(500).render("index", { errorMessage: error.message });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/auth/login", isLoggedOut, (req, res) => res.render("auth/login"));

// POST /auth/login
router.post("/auth/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  // Check that username and password are provided
  if (username === "" || password === "") {
    return res.status(400).render("auth/login", errors.mandatoryLoginFieldsMissing);
  }

  // Check if the user exists in the database using email
  User.findOne({ username })
    .then((user) => {
      // TODO: Should we provide a way for users to reset their password? (very low priority)
      if (!user) {
        return res.status(400).render("auth/login", errors.userNotFound);
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            return res.status(400).render("auth/login", errors.wrongPassword);
          }

          // Add the user object (minus password) to the session object
          req.session.currentUser = user.toObject();
          delete req.session.currentUser.password;

          user.family ? res.redirect(`/family/${user.family._id}`) : res.redirect("/start");
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
