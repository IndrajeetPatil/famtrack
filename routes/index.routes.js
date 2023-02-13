const express = require("express");
const router = express.Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const Family = require("../models/Family");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");
const LifeEvent = require("../models/LifeEvent");


/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/start", isLoggedIn, (req, res, nest) => {
  User.findById(req.session.currentUser._id)
  .populate("family")
  .then(user => {
    if(user.family._id) {
      res.redirect(`/family/${user.family._id}`)
    } else {
      res.render("start")
    }
  })
  
})

router.get("/family/:id", isLoggedIn, (req, res, nest)){
  // render family view?
  
} 

module.exports = router;
