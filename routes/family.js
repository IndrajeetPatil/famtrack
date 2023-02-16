const express = require("express");
const Family = require('../models/Family');
const FamilyMember = require('../models/FamilyMember');
const { calculateAgeFromBirthdate, calculateEarliestBirthyear } = require('../utils/calculations');
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();

router.get("/family/:familyId", isLoggedIn, (req, res, next) => {
  const familyId = req.params.familyId;

  Family.findById(familyId)
    .populate("familyMembers")
    .then(family => {
      const numberOfMembers = family.familyMembers.length;

      // Calculates age and adds it to the member object as "age" property
      family.familyMembers.forEach(member => {
        const age = calculateAgeFromBirthdate(member.dateOfBirth);
        member.age = age;
      })

      // Get earliest birth year
      const earliestBirthyear = calculateEarliestBirthyear(family.familyMembers);

      return res.render("family/details", { members: family.familyMembers, numberOfMembers, earliestBirthyear })
    });
})

module.exports = router;
