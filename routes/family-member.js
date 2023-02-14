const express = require("express");
const router = express.Router();
const { uploader, cloudinary } = require("../config/cloudinary");

const FamilyMember = require("../models/FamilyMember")

router.get("/family/member/create", (req, res, next) =>
  res.render("member/create")
);

router.post(
  "/family/member/create",
  uploader.single("image"),
  (req, res, next) => {
    console.log(req.file);

    const {
      firstName,
      lastName,
      sex,
      dateOfBirth,
      placeOfBirth,
      dateOfDeath,
      placeOfDeath,
      parent,
      sibling,
      child,
    } = req.body;

    const imgName = req.file.originalname;
    const imgPath = req.file.path;
    const publicId = req.file.filename;

    FamilyMember.create({       
        firstname,
        lastName,
        sex,
        dateOfBirth,
        placeOfBirth,
        dateOfDeath,
        placeOfDeath,
        parent,
        sibling,
        child, 
        imgName, 
        imgPath, 
        publicId })
      .then((familyMember) => {
        console.log(familyMember);
        // TODO: Fix redirect here
        res.redirect("/family/member/id");
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
