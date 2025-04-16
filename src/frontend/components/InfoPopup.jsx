// InfoPopup.jsx
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const InfoPopup = ({ type, onClose }) => (
  <Modal show={true} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>{type === "about" ? "About Us" : "Contact Us"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {type === "about" ? (
        <>
          <p>BuyerTalk is a platform where buyers and sellers connect seamlessly.</p>
          <p>We ensure secure transactions and reliable interactions.</p>
        </>
      ) : (
        <>
          <p><FontAwesomeIcon icon={faPhone} /> Phone: +1 234 567 890</p>
          <p><FontAwesomeIcon icon={faEnvelope} /> Email: support@buyertalk.com</p>
          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Location: 1234 Market St</p>
        </>
      )}
    </Modal.Body>
  </Modal>
);

export default InfoPopup;
