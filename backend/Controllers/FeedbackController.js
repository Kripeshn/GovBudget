// controllers/FeedbackController.js
const Feedback = require("../Models/Feedback");
const UserModel = require("../Models/User");


const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    const newFeedback = await Feedback.create({
      user: req.user._id,
      message,
    });
    res.status(201).json({ success: true, feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Submit failed", error });
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "name email");
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedbacks", error });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed", error });
  }
};

module.exports = {submitFeedback,getAllFeedbacks,deleteFeedback}