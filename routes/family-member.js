const express = require("express");
const router = express.Router();
const { uploader, cloudinary } = require("../config/cloudinary");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const axios = require("axios");

const FamilyMember = require("../models/FamilyMember");

router.get("/family/member/create", (req, res) => res.render("member/create"));

router.post("/family/member/create", uploader.single("memberImage"), async (req, res, next) => {
  try {
    let { imgName = "", imgPath = "", publicId = "" } = {};

    if (!req.file) {
      const response = await axios.get(
        `https://ui-avatars.com/api/?background=random&name=${req.body.firstName}+${req.body.lastName}&format=svg`,
      );
      imgPath = response.config.url;
    } else {
      imgName = req.file.originalname;
      imgPath = req.file.path;
      publicId = req.file.filename;
    }

    const familyMember = await FamilyMember.create({ ...req.body, imgName, imgPath, publicId });

    res.redirect(`/family/member/${familyMember._id}`);
  } catch (err) {
    next(err);
  }
});

router.get("/family/member/:memberId", isLoggedIn, (req, res, next) => {
  FamilyMember.findById(req.params.memberId)
    .then((member) => res.render("member/details", { member }))
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
