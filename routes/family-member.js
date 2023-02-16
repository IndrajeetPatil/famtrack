const express = require("express");
const router = express.Router();
const { uploader, cloudinary } = require("../config/cloudinary");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const axios = require("axios");

const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");

const { convertToReadableDate } = require('../utils/calculations');


router.get("/family/member/create", isLoggedIn,(req, res, next) =>{
  // Get userId from session => find family member Ids from user => create array of family member objects
  const userId = req.session.currentUser._id
  let userFamilyMembers = []
  User.findById(userId)
  .populate("family")
  .then((user) => {
    user.family.familyMembers.forEach(familyMemberId => {
      FamilyMember.findById(familyMemberId)
      .then(member => userFamilyMembers.push(member))
      .then(() => res.render("member/create",{familyMember : userFamilyMembers}))
    });
  })
  .catch(err => console.log(err))
}
);

router.post(
  "/family/member/create",
  uploader.single("memberImg"),
  async (req, res, next) => {
    try {
      let { imgName = "", imgPath = "", publicId = "" } = {};

      if (!req.file) {
        const response = await axios.get(
          `https://ui-avatars.com/api/?background=random&name=${req.body.firstName}+${req.body.lastName}&format=svg`
        );
        imgPath = response.config.url;
      } else {
        imgName = req.file.originalname;
        imgPath = req.file.path;
        publicId = req.file.filename;
      }

      const userId = req.session.currentUser._id
      const { family } = await User.findById(userId)

      const familyMember = await FamilyMember.create({
        ...req.body,
        imgName,
        imgPath,
        publicId,
        family
      });

      res.redirect(`/family/member/${familyMember._id}`);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

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

      res.render("member/details", { member, readableDateOfBirth, readableDateOfDeath })
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
