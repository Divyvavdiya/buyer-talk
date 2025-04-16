const express = require("express");
const { placeOrder, getOrders, confirmOrder } = require("../Controller/orderController");
const Order = require("../Models/orderModel"); // ✅ Import Order model
const router = express.Router();

// Place a new order
router.post("/", placeOrder);

// Get orders (support filtering by buyerName)
router.get("/", async (req, res) => {
    try {
      const { buyerName } = req.query;
      let orders;
      if (buyerName) {
        orders = await Order.find({ buyerName });
      } else {
        orders = await Order.find();
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
});

// Confirm order by updating status
router.put("/:orderId", confirmOrder);

module.exports = router;
