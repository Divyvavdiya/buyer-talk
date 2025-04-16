import React, { useEffect, useState } from "react";
import { Container, Alert, Form, Button, Navbar, Accordion, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaArrowLeft, FaBoxOpen } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const TrackShipments = () => {
  const { register, setValue, watch } = useForm({
    defaultValues: { orders: [], search: "" },
  });

  const navigate = useNavigate();
  const orders = watch("orders");
  const search = watch("search");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();
      setValue("orders", data);
    } catch (error) {
      setValue("error", "Failed to load orders. Please try again later.");
    }
  };

  const handleSearch = (e) => {
    setValue("search", e.target.value);
  };

  const getStatusStep = (status) => {
    const statusMap = {
      Pending: 0,
      Confirmed: 1,
      Shipped: 2,
      Delivered: 3,
    };
    return statusMap[status] || 0;
  };

  const getProgressPercent = (status) => {
    const progressMap = {
      Pending: 20,
      Confirmed: 100,
      Shipped: 70,
      Delivered: 100,
    };
    return progressMap[status] || 0;
  };

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="px-3"
        style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
        <Container className="d-flex justify-content-between align-items-center">
          <Button variant="outline-light" onClick={() => navigate("/buyerdashboard")} className="px-3">
            <FaArrowLeft className="me-2" /> Back
          </Button>

          <Navbar.Brand className="text-white mx-auto fw-bold fs-4 d-flex align-items-center">
            <FaShoppingBag className="me-2" /> Track Shipments
          </Navbar.Brand>

          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="py-4">
        {/* Search Bar */}
        <Form className="mb-3">
          <Form.Control 
            type="text" 
            placeholder="Search by Order ID" 
            {...register("search")} 
            onChange={handleSearch} 
          />
        </Form>

        {/* Orders Timeline with Details */}
        <div className="d-flex flex-column align-items-center">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order._id} className="w-100 p-3">
                <div className="bg-dark text-white p-4 rounded shadow-lg">
                  <h5 className="fw-bold">Order ID: {order._id}</h5>
                  <p className="mb-2"><strong>Buyer:</strong> {order.buyerName}</p>
                  <p className="mb-2"><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p className="mb-3"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

                  {/* Timeline UI */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className={`step ${getStatusStep(order.status) >= 0 ? "active" : ""}`}>🟡 Pending</div>
                    <div className={`step ${getStatusStep(order.status) >= 1 ? "active" : ""}`}>✅ Confirmed</div>
                    <div className={`step ${getStatusStep(order.status) >= 2 ? "active" : ""}`}>📦 Shipped</div>
                    <div className={`step ${getStatusStep(order.status) >= 3 ? "active" : ""}`}>🚚 Delivered</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress mt-3" style={{ height: "10px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                      role="progressbar"
                      style={{ width: `${getProgressPercent(order.status)}%` }}
                    ></div>
                  </div>

                  {/* Order Details Accordion */}
                  <Accordion className="mt-3">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header><FaBoxOpen className="me-2" /> View Order Details</Accordion.Header>
                      <Accordion.Body className="bg-light text-dark">
                        {order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <Card key={index} className="mb-2 shadow-sm">
                              <Card.Body>
                                <p className="mb-1"><strong>Item:</strong> {item.name}</p>
                                <p className="mb-1"><strong>Quantity:</strong> {item.quantity}</p>
                                <p className="mb-0"><strong>Price:</strong> ₹{item.price}</p>
                              </Card.Body>
                            </Card>
                          ))
                        ) : (
                          <p>No items found in this order.</p>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            ))
          ) : (
            <Alert variant="warning" className="text-center w-100">
              No orders available
            </Alert>
          )}
        </div>
      </Container>

      {/* CSS Styles */}
      <style>
        {`
          .step {
            font-weight: bold;
            color: grey;
          }
          .active {
            color: white;
          }
          .progress-bar {
            transition: width 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default TrackShipments;
