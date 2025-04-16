const Feedback = require("../Models/feedbackModel");

const submitFeedback = async (req, res) => {
  try {
    const { companyName, email, rating, message } = req.body;

    if (!companyName || !email || !rating || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = new Feedback({ companyName, email, rating, message });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // Fetch latest first
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: "Feedback deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback", error: error.message });
  }
};

module.exports = { submitFeedback, getFeedback, deleteFeedback };
