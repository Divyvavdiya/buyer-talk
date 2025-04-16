import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Navbar, Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue } = useForm();
  const companyId = new URLSearchParams(location.search).get("company");

  useEffect(() => {
    if (!companyId) {
      navigate("/companylist");
    }
    console.log("companyId", companyId);
  }, [companyId, navigate]);

  const cncProductNames = [
    { name: "CNC Milling Cutter",image: "/cnc2.jpg"},
    { name: "Precision Lathe Chuck",},
    { name: "Ball Nose End Mill", },
    { name: "Carbide Drill Bit", },
    { name: "Tapered End Mill",},
    { name: "Coolant Nozzle System",},
  ];

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    console.log("cncProductNames before processing:", cncProductNames);
  
    const stored = localStorage.getItem("products");
    console.log("localStorage products raw:", stored);
  
    const storedProducts = stored ? JSON.parse(stored) : null;
  
    if (storedProducts && Array.isArray(storedProducts)) {
      setProducts(storedProducts);
      console.log("Loaded from localStorage:", storedProducts);
    } else {
      const newProducts = cncProductNames.map((product, index) => ({
        id: index + 1,
        name: product.name,
        price: Math.floor(Math.random() * (2000 - 500 + 1)) + 500,
        image: product.image,
      }));
  
      setProducts(newProducts);
      localStorage.setItem("products", JSON.stringify(newProducts));
      console.log("Generated and saved products:", newProducts);
    }
  }, []);
  

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        setValue(`quantity_${product.id}`, 1); // Initialize form value
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    navigate("/cart", { state: { cart, companyId } });
  };

  return (
    <div className="min-vh-100 d-flex flex-column">

      {/* Navbar */}
      <Navbar
        expand="lg"
        className="px-3 d-flex justify-content-between align-items-center"
        style={{
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
        }}
      >
        <Button 
          variant="outline-light" 
          onClick={() => navigate("/companylist")} 
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
        </Button>

        <Navbar.Brand className="text-white fs-4">
          <strong>Place Order</strong>
        </Navbar.Brand>

        <div></div> {/* Placeholder for spacing alignment */}
      </Navbar>

      {/* Orders Section */}
      <Container className="mt-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {products.map((product) => {
                  const cartItem = cart.find((item) => item.id === product.id);
                  return (
                    <div key={product.id} className="col-md-4 mb-4">
                      <Card 
                        className="shadow-lg border-0 p-3 text-center"
                        style={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "12px" }}
                      >
                        <h5 className="fw-bold" style={{ minHeight: "50px" }}>{product.name}</h5>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="img-fluid my-2"
                            style={{ height: "150px", objectFit: "contain" }}
                          />
                        )}
                        <p className="fw-bold text-primary">₹{product.price}</p>

                        <div>
                          {cartItem ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <Button variant="danger" className="me-2" onClick={() => removeFromCart(product.id)}>
                                <FontAwesomeIcon icon={faMinus} />
                              </Button>
                              <Form.Control
                                type="number"
                                {...register(`quantity_${product.id}`, { min: 1 })}
                                className="text-center w-25"
                                value={cartItem.quantity}
                                readOnly
                              />
                              <Button variant="success" className="ms-2" onClick={() => addToCart(product)}>
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </div>
                          ) : (
                            <Button variant="primary" className="w-100" onClick={() => addToCart(product)}>
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="col-md-4">
              <Card className="p-3 shadow-lg border-0"
                style={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "12px" }}
              >
                <h4 className="text-center mb-3">Cart Summary</h4>
                <h5 className="text-center mt-3">Total: ₹{getTotalPrice()}</h5>
                <Button 
                  type="submit"
                  variant="success" 
                  className="w-100 mt-3" 
                  disabled={cart.length === 0}
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> Proceed to Checkout
                </Button>
              </Card>
            </div>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default PlaceOrderPage;
