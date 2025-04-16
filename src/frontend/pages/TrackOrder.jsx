import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Button, ProgressBar, Form, ListGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const TrackOrder = ({ userType }) => {
  const navigate = useNavigate();
  const { register, watch } = useForm();
  const searchQuery = watch("search", "");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders?${userType === "consumer" ? `buyerName=${userName}` : ""}`
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError("Failed to load orders. Please try again later.");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusProgress = (status) => {
    const statusMap = {
      Pending: 20,
      Confirmed: 100,
      Shipped: 70,
      Delivered: 100,
    };
    return statusMap[status] || 10;
  };

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onClick={() => navigate(userType === "consumer" ? "/consumerdashboard" : "/buyerdashboard")} 
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
        </Button>

        <Navbar.Brand className="text-white fs-4">
          <strong>Track Orders</strong>
        </Navbar.Brand>

        <div></div> {/* Placeholder for spacing alignment */}
      </Navbar>

      {/* Search Form */}
      <Container className="mt-4">
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by Order ID..."
            {...register("search")}
            className="shadow-sm"
          />
        </Form>

        {error && <p className="text-center text-danger">{error}</p>}

        {/* Orders List */}
        <ListGroup className="mt-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <ListGroup.Item
                key={order._id}
                className="shadow-sm p-3 mb-3 rounded"
                style={{ background: "rgba(255, 255, 255, 0.9)" }}
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="text-start">
                    <strong>Order ID:</strong> {order._id} <br />
                    <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()} <br />
                    <strong>Total Amount:</strong> ₹{order.totalAmount} <br />
                    <strong>Status:</strong>
                    <span 
                      className={`fw-bold ms-2 ${
                        order.status === "Delivered" ? "text-success" :
                        order.status === "Shipped" ? "text-primary" :
                        order.status === "Pending" ? "text-warning" :
                        "text-danger"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="w-100 mt-3 mt-md-0">
                    <ProgressBar 
                      now={getStatusProgress(order.status)} 
                      label={`${getStatusProgress(order.status)}%`} 
                      className="mt-2"
                    />
                  </div>

                  {/* Buyer Action */}
                  {userType === "buyer" && order.status !== "Delivered" && (
                    <Button 
                      variant="success" 
                      className="mt-2 mt-md-0"
                      onClick={() => updateOrderStatus(order._id, "Delivered")}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} /> Mark as Delivered
                    </Button>
                  )}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-center text-white">No orders found.</p>
          )}
        </ListGroup>
      </Container>
    </div>
  );
};

export default TrackOrder;
