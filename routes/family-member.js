const express = require("express");
const router = express.Router();

router.get("/family/member/create", (req,res,next) => res.render("member/create"))

module.exports = router;
