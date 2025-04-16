import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Table, Button, Alert, Navbar } from "react-bootstrap";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const { setValue, watch } = useForm({
    defaultValues: {
      users: [],
      message: null,
    },
  });

  const navigate = useNavigate();

  // Fetch users when the component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setValue("users", data);
    } catch (error) {
      setValue("message", { type: "danger", text: "Error fetching users." });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setValue("message", { type: "success", text: "User deleted successfully!" });
        setValue("users", watch("users").filter((user) => user._id !== id));
      } else {
        setValue("message", { type: "danger", text: "Failed to delete user." });
      }
    } catch (error) {
      setValue("message", { type: "danger", text: "Error deleting user." });
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>
      {/* Navbar */}
      <Navbar
        expand="lg"
        className="px-3"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
        }}
      >
        <Container className="d-flex justify-content-between align-items-center">
          <Button variant="outline-light" onClick={() => navigate("/AdminDashboard")} className="px-3">
            <FaArrowLeft className="me-2" /> Back
          </Button>

          <Navbar.Brand className="text-white fs-4">
            <strong>Manage Users</strong>
          </Navbar.Brand>

          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {watch("message") && <Alert variant={watch("message").type}>{watch("message").text}</Alert>}

        {/* Users Table */}
        <Table striped bordered hover variant="dark" className="text-center mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {watch("users").length === 0 ? (
              <tr>
                <td colSpan="5">No users found.</td>
              </tr>
            ) : (
              watch("users").map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(user._id)}>
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default ManageUsers;
