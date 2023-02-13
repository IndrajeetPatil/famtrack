const express = require("express");
const router = express.Router();

const Family = require("../models/Family");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");
const LifeEvent = require("../models/LifeEvent");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
