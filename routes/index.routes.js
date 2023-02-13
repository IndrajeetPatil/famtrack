const express = require('express');
const router = express.Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/start", isLoggedIn, (req, res, nest) => {
  //If the user has a family id => rederict to /family/:id
  User.findByID()
})

router.get("/family/:id", isLoggedIn, (req, res, nest)){
  
}

module.exports = router;
