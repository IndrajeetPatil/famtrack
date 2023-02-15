const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
  familyName: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
});

const Family = mongoose.model("Family", familySchema);
