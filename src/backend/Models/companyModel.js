const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  requestedBy: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
});

module.exports = mongoose.model("Company", companySchema);
