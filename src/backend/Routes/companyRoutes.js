const express = require("express");
const router = express.Router();
const Company = require("../Models/companyModel");

// Route to request a new company
router.post("/request", async (req, res) => {
  try {
    const { companyName, requestedBy } = req.body;
    if (!companyName) return res.status(400).json({ error: "Company name is required" });

    const newCompany = new Company({ name: companyName, requestedBy });
    await newCompany.save();
    res.json({ message: "Company request submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to fetch approved companies
router.get("/approved", async (req, res) => {
  try {
    const companies = await Company.find({ status: "Approved" });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route for admin to approve a company
router.put("/approve/:id", async (req, res) => {
  try {
    await Company.findByIdAndUpdate(req.params.id, { status: "Approved" });
    res.json({ message: "Company approved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get pending company requests
router.get("/pending", async (req, res) => {
  try {
    const companies = await Company.find({ status: "Pending" });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch user-specific company requests
router.get("/user-requests", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: "User is required" });

    const companies = await Company.find({ requestedBy: user });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to delete a company by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
