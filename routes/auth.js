const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const duplicateKeyErrorCode = 11000;

const { errors, signalBadInput } = require("../utils/errors");

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
router.post("/auth/signup", isLoggedOut, (req, res, next) => {
  const { firstName, lastName, username, email, password, birthDay, birthMonth, birthYear } = req.body;

  // Check that username, email, and password are provided
  // Although these fields are required in the HTML form, we still need to check here
  // in case the user manipulates the HTML and removes the required attribute
  if (username === "" || email === "" || password === "") {
    return signalBadInput(res, "index", errors.mandatorySignupFieldsMissing);
  }

  // Validate birthdate is within ranges
  if (birthDay <= 0 || birthDay > 31) {
    return signalBadInput(res, "index", errors.invalidBirthdate);
  }

  if (birthMonth <= 0 || birthMonth > 12) {
    return signalBadInput(res, "index", errors.mandatorySignupFieldsMissing);
  }

  // Create birthdate from birthDay, birthMonth and birthYear
  const dateOfBirth = new Date(parseInt(birthYear), parseInt(birthMonth), parseInt(birthDay));

  // Validate birthdate is not in the future
  const today = new Date();
  if (today - dateOfBirth < 0) {
    return signalBadInput(res, "index", errors.birthInFuture);
  }

  // Validate user has agreed to terms and conditions
  if (req.body.terms !== "on") return signalBadInput(res, "index", errors.termsNotAccepted);

  // Validate uniqueness of username and email
  User.findOne({ username }).then((user) => {
    if (user) return signalBadInput(res, "index", errors.duplicateUsername);
  });

  User.findOne({ email }).then((user) => {
    if (user) return signalBadInput(res, "index", errors.duplicateEmail);
  });

  // This regular expression checks password for special characters and minimum length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) return signalBadInput(res, "index", errors.weakPassword);

  // Create a new user in the database
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) =>
      User.create({ firstName, lastName, dateOfBirth, username, email, password: hashedPassword }),
    )
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
    return signalBadInput(res, "auth/login", errors.mandatoryLoginFieldsMissing);
  }

  // Check if the user exists in the database using email
  User.findOne({ username })
    .then((user) => {
      if (!user) return signalBadInput(res, "auth/login", errors.userNotFound);

      // If user is found, check if the entered password matches the database one
      // If it does, add the user object (minus password) to the session object
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) return signalBadInput(res, "auth/login", errors.wrongPassword);
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
    if (err) return res.status(500).render("auth/logout", { errorMessage: err.message });
    res.redirect("/");
  });
});

module.exports = router;
