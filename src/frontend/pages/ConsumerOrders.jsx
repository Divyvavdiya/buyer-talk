import React, { useEffect, useState } from "react";
import { Container, Alert, Button, Card, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";

const ConsumerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const { handleSubmit } = useForm();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders?buyerName=${userName}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column"
      style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>

      {/* Navbar */}
      <Navbar
        expand="lg"
        className="px-3 d-flex justify-content-between align-items-center"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
        }}
      >
        <Button 
          variant="outline-light" 
          onClick={() => navigate("/consumerdashboard")} 
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Back
        </Button>

        <Navbar.Brand className="text-white fs-4">
          <strong>My Orders</strong>
        </Navbar.Brand>

        <div></div> {/* Placeholder for spacing alignment */}
      </Navbar>

      {/* Orders Section */}
      <Container className="mt-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex flex-wrap justify-content-center gap-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card 
                key={order._id} 
                className="p-3 shadow-lg border-0" 
                style={{ 
                  width: "22rem", 
                  background: "rgba(255, 255, 255, 0.9)", 
                  borderRadius: "12px" 
                }}
              >
                <Card.Body>
                  <Card.Title className="fw-bold text-center mb-3">
                    📅 Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </Card.Title>

                  <Card.Text>
                    <strong>Items:</strong>
                    <ul className="mb-2">
                      {order.items?.map((item, index) => (
                        <li key={index}>{item.name} (x{item.quantity})</li>
                      )) || "No items found"}
                    </ul>

                    <div className="d-flex justify-content-between">
                      <strong>Total:</strong> 
                      <span className="fw-bold text-success">₹{order.totalAmount}</span>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <strong>Status:</strong> 
                      <span 
                        className={`fw-bold ${
                          order.status === "Completed" ? "text-success" : 
                          order.status === "Pending" ? "text-warning" : "text-danger"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <strong>Delivery:</strong> 
                      <span className="text-primary">
                        {order.deliveryStatus || "Not Dispatched"}
                      </span>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-center text-white">No orders found.</p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ConsumerOrders;
