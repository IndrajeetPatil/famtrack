const express = require("express");
const router = express.Router();
const { uploader, cloudinary } = require("../config/cloudinary");
const isLoggedOut = require("../middleware/isLoggedOut");
const axios = require("axios");

const FamilyMember = require("../models/FamilyMember");

router.get("/family/member/create", (req, res, next) =>
  res.render("member/create")
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

      const familyMember = await FamilyMember.create({
        ...req.body,
        imgName,
        imgPath,
        publicId,
      });

      res.redirect(`/family/member/${familyMember._id}`);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

module.exports = router;
