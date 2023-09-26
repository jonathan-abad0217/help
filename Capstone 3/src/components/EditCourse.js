import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";

// Add the props course to get the specific id of the course
export default function EditCourse({ product, fetchData }) {
  // State for courseId for the fetch URL
  const [productId, setProductId] = useState(null);

  // Forms State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // state for editCourse modals to open/close
  const [showEdit, setShowEdit] = useState(false);

  // Function for opening the modal
  const openEdit = (productId) => {
    fetch(`http://localhost:4000/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        // populate all input values with course info that we fetched
        setProductId(data._id);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
      });

    // Then, open the modal
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setName("");
    setDescription("");
    setPrice(0);
  };

  // function to edit course
  const editProduct = (e, productId) => {
    e.preventDefault();

    fetch(`http://localhost:4000/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data === true) {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Product Successfully Updated",
          });
          closeEdit();
          fetchData();
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Please try again",
          });
          closeEdit();
          fetchData();
        }
      });
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => openEdit(product)}>
        Edit
      </Button>

      {/*EDIT MODAL*/}
      <Modal show={showEdit} onHide={closeEdit}>
        <Form onSubmit={(e) => editProduct(e, productId)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="courseName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="courseDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="coursePrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
