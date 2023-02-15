const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
  familyName: {
    type: String,
    required: true,
  },
  familyMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyMember",
    },
  ],
});

const Family = mongoose.model("Family", familySchema);

module.exports = Family;
