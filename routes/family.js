const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const Family = require("../models/Family");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");
const LifeEvent = require("../models/LifeEvent");

const { calculateAgeFromBirthdate, calculateEarliestBirthyear } = require('../utils/calculations');

const { uploader, cloudinary } = require("../config/cloudinary");

router.get("/family/details", isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  res.render(`family/${user.family._id}/details`);
});

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

router.get("/family/:familyId", isLoggedIn, (req, res, next) => {
  const familyId = req.params.familyId;

  Family.findById(familyId)
    .populate("familyMembers")
    .then((family) => {
      const numberOfMembers = family.familyMembers.length;

      // Calculates age and adds it to the member object as "age" property
      family.familyMembers.forEach((member) => {
        const age = calculateAgeFromBirthdate(member.dateOfBirth);
        member.age = age;
      })

      // Get earliest birth year
      const earliestBirthyear = calculateEarliestBirthyear(family.familyMembers);

      return res.render("family/details", { members: family.familyMembers, numberOfMembers, earliestBirthyear })
    })
    .catch((err) => next(err));
})

module.exports = router;
