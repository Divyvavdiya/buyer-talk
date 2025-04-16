import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, ListGroup, Button, Alert, Navbar } from "react-bootstrap";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageFeedback = () => {
  const { setValue, watch } = useForm({
    defaultValues: {
      feedbacks: [],
      message: null,
    },
  });

  const navigate = useNavigate();

  // Fetch feedback when the component loads
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/feedback");
      if (!response.ok) throw new Error("Failed to fetch feedback");

      const data = await response.json();
      setValue("feedbacks", data);
    } catch (error) {
      setValue("message", { type: "danger", text: "Error fetching feedback." });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setValue("message", { type: "success", text: "Feedback deleted successfully!" });
        setValue("feedbacks", watch("feedbacks").filter((feedback) => feedback._id !== id));
      } else {
        setValue("message", { type: "danger", text: "Failed to delete feedback." });
      }
    } catch (error) {
      setValue("message", { type: "danger", text: "Error deleting feedback." });
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="px-3"
              style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
        <Container className="d-flex justify-content-between align-items-center">
          <Button variant="outline-light" onClick={() => navigate("/AdminDashboard")} className="px-3">
            <FaArrowLeft className="me-2" /> Back
          </Button>

          <Navbar.Brand className="text-white fs-4">
            <strong>Manage Feedback</strong>
          </Navbar.Brand>

          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {watch("message") && <Alert variant={watch("message").type}>{watch("message").text}</Alert>}

        <ListGroup>
          {watch("feedbacks").length === 0 ? (
            <ListGroup.Item className="text-center text-muted">No feedback found.</ListGroup.Item>
          ) : (
            watch("feedbacks").map((feedback) => (
              <ListGroup.Item key={feedback._id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{feedback.companyName}</strong> ({feedback.email}) - <em>Rating: {feedback.rating}</em>
                  <p className="mb-1">{feedback.message}</p>
                </div>
                <Button variant="danger" onClick={() => handleDelete(feedback._id)}>
                  <FaTrash /> Delete
                </Button>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Container>
    </div>
  );
};

export default ManageFeedback;
