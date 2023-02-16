const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const Family = require("../models/Family");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");
const LifeEvent = require("../models/LifeEvent");

const { uploader, cloudinary } = require("../config/cloudinary");

router.get("/family/details", isLoggedIn, (req, res) => res.render("family/details"));

router.get("/family/create", isLoggedIn, (req, res) => res.render("family/create"));

router.post("/family/create", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;

  User.findById(userId)
    .populate("family")
    .then((user) => {
      Family.create({ familyName: req.body.familyName }).then((family) => {
        User.findByIdAndUpdate(userId, { family: family._id }, { new: true }).then((user) => {
          FamilyMember.create({ firstName: user.firstName, lastName: user.lastName, family: user.family }).then(
            (member) => {
              Family.findByIdAndUpdate(user.family._id, { $push: { familyMembers: member._id } }).then(() => {
                res.render("family/details");
              });
            },
          );
        });
      });
    })
    .catch((err) => next(err));
});

module.exports = router;
