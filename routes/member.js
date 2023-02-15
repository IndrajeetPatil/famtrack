const express = require("express");
const router = express.Router();

const { uploader, cloudinary } = require("../config/cloudinary");

// Require needed models in order to use the database functions
const User = require("../models/User");

// Require needed middleware to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/family/member/", isLoggedOut, (req, res) => res.render("/member/details"));

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
