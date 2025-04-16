import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const Login = ({ toggleModal }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    axios.post("http://localhost:5000/api/users/login", data)

      .then((response) => {
        const { token, user } = response.data;

        if (!user) {
          alert("Login failed: User not found.");
          return;
        }

        // Store token and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name);

        alert("Login successful!");
        console.log("User Role:", user.role);
        console.log("Navigating to:", `/${user.role}dashboard`);
        
        if (user.role === "Consumer") {
          navigate("/consumerdashboard");
        } else if (user.role === "Admin") {
          navigate("/admindashboard");
        } else if (user.role === "Business") {
          navigate("/buyerdashboard");
        } else {
          alert("Invalid role.");
        }

        setTimeout(() => {
          toggleModal();
        }, 100);
      })
      .catch((error) => {
        console.error("Login error:", error.response?.data || error.message);
        alert("Invalid email or password");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mt-3">
          <Form.Control
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-danger">{errors.email.message}</p>}
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-danger">{errors.password.message}</p>}
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Select Role</Form.Label>
          <Form.Select {...register("role", { required: "Role is required" })}>
            <option value="Consumer">Consumer</option>
            <option value="Business">Business</option>
            <option value="Admin">Admin</option>
          </Form.Select>
        </Form.Group>
        <Button className="mt-3 w-100" type="submit">
          Login
        </Button>
        


      </Form>
     

    </div>
    
  );
};

export default Login;
