const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
