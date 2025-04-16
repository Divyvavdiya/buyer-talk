import React from "react";
import { Modal, Button } from "react-bootstrap";
import Login from "./Login";
import Signup from "./Signup";

const LoginSignupModal = ({ showModal, toggleModal, isSignup, setIsSignup }) => {
  return (
    <Modal show={showModal} onHide={toggleModal} centered>
      <Modal.Header closeButton />
      <Modal.Body>
        {isSignup ? <Signup setIsSignup={setIsSignup} /> : <Login toggleModal={toggleModal} setIsSignup={setIsSignup} />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginSignupModal;
