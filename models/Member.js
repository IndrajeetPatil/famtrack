const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
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
    enum: ["Male", "Female", "Non-binary"],
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  placeOfBirth: {
    type: String,
    required: false,
  },
  dateOfDeath: {
    type: Date,
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
    required: false,
    enum: ["Parent", "Sibling", "Child"],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  sibling: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
  },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
