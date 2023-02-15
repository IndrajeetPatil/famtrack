const express = require("express");
const router = express.Router();

// TODO: Remove models which are not needed
const Family = require("../models/Family");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");
const LifeEvent = require("../models/LifeEvent");

const { uploader, cloudinary } = require("../config/cloudinary");
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
