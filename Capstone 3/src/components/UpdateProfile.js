import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import swal from "sweetalert2";

function UpdateProfile({ onUpdate }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, mobileNo }),
      }
    );

    if (response) {
      onUpdate();
      swal.fire({
        title: "Success",
        icon: "success",
        text: "Successfully updated profile",
      });
    } else {
      swal.fire({
        title: "Error!",
        icon: "error",
        text: "Error updating profile",
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="mobileNo">
        <Form.Label>Mobile No</Form.Label>
        <Form.Control
          type="text"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" className="mt-3">
        Update Profile
      </Button>
    </Form>
  );
}

export default UpdateProfile