const express = require("express");
const { requireSignIn, isAdmin } = require("../Middlewares/Auth");
const {
    submitFeedback, getAllFeedbacks,
    deleteFeedback,
} = require("../Controllers/FeedbackController");

const router = express.Router();

// Route to submit feedback (accessible to all authenticated users)
router.post("/feedback", requireSignIn, submitFeedback);

// Route to view all feedback (only for admins)
router.get("/get-feedbacks", requireSignIn, isAdmin, getAllFeedbacks);

// Route to delete feedback (only for admins)
router.delete("/feedback/:feedbackId", requireSignIn, isAdmin, deleteFeedback);

module.exports = router;
