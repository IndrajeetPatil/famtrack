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
  imgName: String,
  imgPath: String,
  publicId: String,
  lifeEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LifeEvent",
    },
  ],
  relationship: {
    type: String,
    required: true,
    enum: ["Parent", "Sibling", "Child"],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
  sibling: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  },
});

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);

module.exports = FamilyMember;
