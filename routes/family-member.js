const express = require("express");
const router = express.Router();
const { uploader, cloudinary } = require("../config/cloudinary");
const isLoggedOut = require("../middleware/isLoggedOut");
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

router.get("/family/member/:id", isLoggedIn, (req, res, next) => {
  User.findById(req.params.id)
    //.populate("family")
    .then((user) => res.render("member/details", { user }))
    .catch((err) => next(err));
});

router.get("/family/member/:id/edit", isLoggedIn, (req, res, next) => {
  User.findById(req.params.id)
    //.populate("family")
    .then((user) => res.render("member/edit", { user }))
    .catch((err) => next(err));
});

router.post("/family/member/:id/edit", uploader.single("family-member-photo"), (req, res, next) => {
  const imgName = req.file.originalname;
  const imgPath = req.file.path;
  const publicId = req.file.filename;

  User.findByIdAndUpdate(req.params.id, { ...req.body, imgName, imgPath, publicId })
    .then((user) => res.redirect(`/family/member/${req.params.id}`))
    .catch((err) => next(err));
});

router.get("/family/member/:id/delete", isLoggedIn, (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then((member) => {
      if (member.imgPath) cloudinary.uploader.destroy(member.publicId);
      res.redirect("/family/details");
    })
    .catch((err) => next(err));
});

module.exports = router;
