import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const Signup = ({ setIsSignup }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    axios.post("http://localhost:5000/api/users/signup", data)
      .then((response) => {
        console.log(response.data);
        alert("Signup successful! Redirecting to login...");
        setIsSignup(false);  
      })
      .catch((error) => {
        console.error("Signup error:", error.response?.data || error.message);
        alert("Signup failed. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Sign Up</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mt-3">
        <Form.Control
            type="text"
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </Form.Group>
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
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
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
        <Button className="mt-3 w-100" type="submit">Sign Up</Button>
      </Form>
    </div>
  );
};

export default Signup;
