const express = require("express");
const router = express.Router();

const { uploader, cloudinary } = require("../config/cloudinary");

// Require needed models in order to use the database functions
const User = require("../models/User");

// Require needed middleware to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/family/member/", isLoggedOut, (req, res, next) => res.render("index"));

router.get("/family/member/:id", isLoggedIn, (req, res, next) => {
  User.findById(req.params.id)
    .populate("family")
    .then((user) => res.render("member/details", { user }))
    .catch((err) => next(err));
});

module.exports = router;
