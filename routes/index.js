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
router.get("/", isLoggedOut, (req, res) => res.render("index"));

router.get("/start", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;

  User.findById(userId)
    .populate("family")
    .then((user) => {
      if (user.family) {
        res.redirect(`/family/${user.family._id}`);
      } else {
        const { familyName } = req.session.currentUser.lastName;
        Family.create({ familyName })
          .then((family) => User.findByIdAndUpdate(userId, { family: family._id }).catch((err) => next(err)))
          .then((user) => FamilyMember.create({ ...user }).catch((err) => next(err)))
          .then((member) =>
            Family.findByIdAndUpdate(user.family._id, { $push: { familyMembers: member._id } }).catch((err) =>
              next(err)
            )
          )
          .then((member) => res.redirect(`/family/${user.family._id}`))
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
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
