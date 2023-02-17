const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const Family = require("../models/Family");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");
const LifeEvent = require("../models/LifeEvent");

const { calculateAgeFromBirthdate, calculateEarliestBirthyear } = require("../utils/calculations");

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
          FamilyMember.create({
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            family: user.family,
          }).then((member) => {
            Family.findByIdAndUpdate(user.family._id, { $push: { familyMembers: member._id } }).then(() => {
              res.redirect(`/family/${user.family._id}`);
            });
          });
        });
      });
    })
    .catch((err) => next(err));
});

router.get("/family/:familyId", isLoggedIn, (req, res, next) => {
  const familyId = req.params.familyId;

  Family.findById(familyId)
    .populate("familyMembers")
    .then((family) => {
      const numberOfMembers = family.familyMembers.length;
      family.familyMembers.forEach((member) => (member.age = calculateAgeFromBirthdate(member.dateOfBirth)));
      const earliestBirthyear = calculateEarliestBirthyear(family.familyMembers);

      return res.render("family/details", {
        familyName: family.familyName,
        familyId: family._id,
        members: family.familyMembers,
        numberOfMembers,
        earliestBirthyear,
      });
    })
    .catch((err) => next(err));
});

router.get("/family/:familyId/edit", isLoggedIn, (req, res, next) => {
  const familyId = req.params.familyId;

  Family.findById(familyId)
    .then((family) => res.render("family/edit", { family }))
    .catch((err) => next(err));
});

router.post("/family/:familyId/edit", isLoggedIn, (req, res, next) => {
  const familyId = req.params.familyId;

  Family.findByIdAndUpdate(familyId, { familyName: req.body.familyName }, { new: true })
    .populate("familyMembers")
    .then((family) => {
      const numberOfMembers = family.familyMembers.length;
      family.familyMembers.forEach((member) => (member.age = calculateAgeFromBirthdate(member.dateOfBirth)));
      const earliestBirthyear = calculateEarliestBirthyear(family.familyMembers);

      return res.render("family/details", {
        familyName: family.familyName,
        familyId: family._id,
        members: family.familyMembers,
        numberOfMembers,
        earliestBirthyear,
      });
    })
    .catch((err) => next(err));
});

router.get("/family/:familyId/delete", isLoggedIn, (req, res, next) => {
  const familyId = req.params.familyId;

  Family.findById(familyId)
    .then((family) => res.render("family/delete", { family }))
    .catch((err) => next(err));
});

router.post("/family/:familyId/delete", isLoggedIn, (req, res, next) => {
  const familyId = req.params.familyId;

  Family.findByIdAndDelete(familyId, { new: true })
    .then(() => res.render("start"))
    .catch((err) => next(err));
});

module.exports = router;
