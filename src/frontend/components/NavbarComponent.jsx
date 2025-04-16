// NavbarComponent.jsx
import { Navbar, Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";

const NavbarComponent = ({ toggleOffcanvas, toggleModal }) => (
  <Navbar style={{ backgroundColor: "#000" }} variant="dark" className="px-2">
    <Container fluid>
      <Button variant="dark" onClick={toggleOffcanvas} className="me-2">
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Navbar.Brand className="mx-auto" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
        <strong>BuyerTalk</strong>
      </Navbar.Brand>
      <Button className="custom-login-btn px-1 py-1 fs-11 rounded-3" onClick={toggleModal}>Login / Signup</Button>
    </Container>
  </Navbar>
);

export default NavbarComponent;
