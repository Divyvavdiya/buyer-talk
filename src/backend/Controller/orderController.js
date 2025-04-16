const Order = require("../Models/orderModel");

exports.placeOrder = async (req, res) => {
  try {
    console.log("Order Data Received:", req.body);
    const { items, totalAmount, buyerName, status } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid items. Cart cannot be empty." });
    }

    const newOrder = new Order({
      items,
      totalAmount,
      buyerName,
      status: status || "Pending", // Default to "Pending" if not provided
      createdAt: Date.now(),
    });
   


    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.findByIdAndUpdate(orderId, { status: "Confirmed" });
    res.status(200).json({ message: "Order confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error confirming order", error });
  }
};
