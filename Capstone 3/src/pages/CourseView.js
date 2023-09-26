import { useState, useEffect, useContext } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function CourseView() {
  //change from courseId to productId
  const { productId } = useParams();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const enroll = (productId) => {
    fetch(`http://localhost:4000/users/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);

        if (data.message === "Enrolled Successfully.") {
          Swal.fire({
            title: "Successfully enrolled",
            icon: "success",
            text: "You have successfully enrolled for this course",
          });

          navigate("/courses");
        } else {
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
            text: "Please try again",
          });
        }
      });
  };

  useEffect(() => {
    console.log(productId);
    //use api get specific product
    fetch(`http://localhost:4000/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
      });
  }, [productId]);

  return (
    <Container className="mt-5">
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>{name}</Card.Title>
              <Card.Subtitle>Description:</Card.Subtitle>
              <Card.Text>{description}</Card.Text>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>PhP {price}</Card.Text>
              <Card.Subtitle>Class Schedule</Card.Subtitle>
              <Card.Text>8 am - 5 pm</Card.Text>
              {user.id !== null ? (
                <Button variant="primary" onClick={() => enroll(productId)}>
                  Enroll
                </Button>
              ) : (
                <Link className="btn btn-danger btn-block" to="/login">
                  Login to enroll
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
