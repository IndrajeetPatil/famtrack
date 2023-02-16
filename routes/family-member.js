const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");
const Family = require("../models/Family");

const { errors, signalBadInput } = require("../utils/errors");
const { convertToReadableDate, calculateAgeFromBirthdate } = require("../utils/calculations");
const { uploader, cloudinary } = require("../config/cloudinary");


router.get("/family/member/create", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  let userFamilyMembers = [];

  User.findById(userId)
    .populate("family")
    .then((user) => {
      user.family.familyMembers.forEach((familyMemberId) => {
        FamilyMember.findById(familyMemberId)
          .then((member) => userFamilyMembers.push(member))
          .then(() => res.render("member/create", { familyMember: userFamilyMembers }));
      });
    })
    .catch((err) => next(err));
});

router.post("/family/member/create", uploader.single("memberImg"), async (req, res, next) => {
  // input validation
  if (req.body.dateOfDeath && req.body.dateOfBirth > req.body.dateOfDeath) {
    return res.status(400).render("member/create", errors.deathBeforeBirth);
  }

  if (req.body.dateOfBirth > new Date()) {
    return res.status(400).render("member/create", errors.birthInFuture);
  }

  const userId = req.session.currentUser._id;
  const imgName = req.file?.originalname;
  const imgPath = req.file?.path;
  const publicId = req.file?.filename;

  User.findById(userId)
    .populate("family")
    .then((user) => {
      const family = user.family;
      FamilyMember.create({ ...req.body, imgName, imgPath, publicId, family }).then((familyMember) => {
        const family = user.family._id;
        Family.findByIdAndUpdate(family, { $push: { familyMembers: familyMember._id } }).then(() =>
          res.redirect(`/family/member/${familyMember._id}`),
        );
      });
    })
    .catch((err) => next(err));
});

router.get("/family/member/:memberId", isLoggedIn, (req, res, next) => {
  FamilyMember.findById(req.params.memberId)
    .populate("parent")
    .populate("sibling")
    .populate("child")
    .populate("family")
    .then((member) => {
      const readableDateOfBirth = convertToReadableDate(member.dateOfBirth);
      let readableDateOfDeath;

      if (member.dateOfDeath) {
        readableDateOfDeath = convertToReadableDate(member.dateOfDeath);
      }

      // Calculates age and adds it to the member object as "age" property
      member.parent.forEach((parent) => parent.age = calculateAgeFromBirthdate(parent.dateOfBirth));

      member.sibling.forEach((sibling) => {
        const age = calculateAgeFromBirthdate(sibling.dateOfBirth);
        sibling.age = age;
      });

      member.child.forEach((child) => {
        const age = calculateAgeFromBirthdate(child.dateOfBirth);
        child.age = age;
      });

      res.render("member/details", { member, readableDateOfBirth, readableDateOfDeath });
    })
    .catch((err) => next(err));
});

router.get("/family/member/:memberId/edit", isLoggedIn, (req, res, next) => {
  FamilyMember.findById(req.params.memberId)
    .then((member) => res.render("member/edit", { member }))
    .catch((err) => next(err));
});

router.post("/family/member/:memberId/edit", uploader.single("family-member-photo"), (req, res, next) => {
  const imgName = req.file.originalname;
  const imgPath = req.file.path;
  const publicId = req.file.filename;

  FamilyMember.findByIdAndUpdate(req.params.id, { ...req.body, imgName, imgPath, publicId })
    .then((member) => res.redirect(`/family/member/${req.params.memberId}`))
    .catch((err) => next(err));
});

router.get("/family/member/:memberId/delete", isLoggedIn, (req, res, next) => {
  FamilyMember.findByIdAndDelete(req.params.memberId)
    .then((member) => {
      if (member.imgPath) cloudinary.uploader.destroy(member.publicId);
      res.redirect("/family/details");
    })
    .catch((err) => next(err));
});

module.exports = router;
