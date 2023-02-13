const mongoose = require("mongoose");

const lifeEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
});

const LifeEvent = mongoose.model("LifeEvent", lifeEventSchema);

module.exports = LifeEvent;
