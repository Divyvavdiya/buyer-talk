import React, { useEffect } from "react";
import { Container, Navbar, ListGroup, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageOrders = () => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: { orders: [] },
  });

  const navigate = useNavigate();
  const orders = watch("orders");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();
      setValue("orders", data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchOrders();
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="px-3"
        style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
        <Container className="d-flex justify-content-between align-items-center">
          {/* Back Button */}
          <Button variant="outline-light" onClick={() => navigate("/buyerdashboard")} className="px-3">
            <FaArrowLeft className="me-2" /> Back
          </Button>

          {/* Centered "Manage Orders" Text */}
          <Navbar.Brand className="text-white mx-auto fw-bold fs-4 d-flex align-items-center">
            <FaShoppingBag className="me-2" /> Manage Orders
          </Navbar.Brand>

          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      {/* Orders List */}
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <ListGroup className="shadow-lg rounded-3">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <ListGroup.Item key={order._id} className="d-flex justify-content-between align-items-center p-4"
                    style={{ background: "rgba(0, 0, 0, 0.85)", color: "white", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                    <div>
                      <h5 className="fw-bold">Order ID: {order._id}</h5>
                      <p className="mb-1"><strong>Buyer:</strong> {order.buyerName}</p>
                      <p className="mb-1"><strong>Total:</strong> ₹{order.totalAmount}</p>
                      <p className="mb-0"><strong>Status:</strong> <span className="fw-bold text-info">{order.status}</span></p>
                    </div>
                    <div className="d-flex gap-2">
                      {order.status === "Pending" && (
                        <Button variant="warning" size="sm" onClick={() => updateOrderStatus(order._id, "Shipped")}>
                          Ship
                        </Button>
                      )}
                      {order.status === "Shipped" && (
                        <Button variant="success" size="sm" onClick={() => updateOrderStatus(order._id, "Delivered")}>
                          Deliver
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center text-white fw-bold p-4" style={{ background: "rgba(0, 0, 0, 0.85)" }}>
                  No orders available
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageOrders;
