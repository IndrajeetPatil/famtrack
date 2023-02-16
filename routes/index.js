const express = require("express");
const router = express.Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const User = require("../models/User");

/* GET home page */
router.get("/", isLoggedOut, (req, res) => res.render("index"));

router.get("/about", (req, res) => res.render("about"));
router.get("/terms", (req, res) => res.render("terms"));

router.get("/start", isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate("family")
    .then((user) => (user.family ? res.redirect(`/family/${user.family._id}`) : res.render("start")))
    .catch((err) => next(err));
});

module.exports = router;
