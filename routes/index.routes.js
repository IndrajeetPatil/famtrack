const express = require('express');
const router = express.Router();

const express = require('express');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const router = express.Router();

/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("index");
});



module.exports = router;
