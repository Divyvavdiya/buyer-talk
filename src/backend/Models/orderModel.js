const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [{ id: Number, name: String, price: Number, quantity: Number }],
  totalAmount: Number,
  status: { type: String, default: "Pending" },
  buyerName: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
