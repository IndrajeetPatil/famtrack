const express = require("express");
const router = express.Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const Family = require("../models/Family");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");
const LifeEvent = require("../models/LifeEvent");

const { uploader, cloudinary } = require("../config/cloudinary");

/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/start", isLoggedIn, (req, res, nest) => {
  User.findById(req.session.currentUser._id)
    .populate("family")
    .then((user) => {
      if (user.family._id) {
        res.redirect(`/family/${user.family._id}`);
      } else {
        res.render("start");
      }
    });
});

router.get("/family/:id", isLoggedIn, (req, res, nest) => {
  // render family view?
});

// this is assuming HTML looks like the following:
// <input type="file" name="family-member-photo">
router.post("/create-family-member", uploader.single("family-member-photo"), (req, res, next) => {
  const imgName = req.file.originalname;
  const imgPath = req.file.path;
  const publicId = req.file.filename;
  const family = req.session.currentUser.family;

  User.create({ ...req.body, imgName, imgPath, publicId, family })
    .then((user) => res.redirect("/overview"))
    .catch((err) => next(err));
});

module.exports = router;
