const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  placeOfBirth: {
    type: String,
    required: false,
  },
  placeOfDeath: {
    type: String,
    required: false,
  },
  lifeEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LifeEvent",
    },
  ],
  relationship: {
    type: String,
    required: true,
    enum: ["Father", "Mother", "Brother", "Sister", "Son", "Daughter"],
  },
  father: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
  mother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
  brother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
  sister: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
  son: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
  daughter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
});

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);

module.exports = FamilyMember;
