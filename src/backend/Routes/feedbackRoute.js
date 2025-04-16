const express = require("express");
const { submitFeedback, getFeedback, deleteFeedback} = require("../Controller/feedbackController");

const router = express.Router();

router.post("/", submitFeedback);

router.get("/", getFeedback);
router.delete("/:id", deleteFeedback);

module.exports = router;
