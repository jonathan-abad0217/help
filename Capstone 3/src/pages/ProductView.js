import { useState, useEffect, useContext } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams, NavLink } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function ProductView() {
  //change from courseId to productId
  const { productId } = useParams();

  const { user } = useContext(UserContext);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  const handleAddToCart = async () => {
    try {
      if (!user.id) {
        window.location.href = "/login";
        return;
      }

      const cartResponse = await fetch(
        `http://localhost:4000/users/cart/view`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const cartData = await cartResponse.json();

      // If the user doesn't have a cart, create one
      if (!cartData.userCart) {
        const createCartResponse = await fetch(
          `http://localhost:4000/users/cart/addToCart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify([]),
          }
        );
        const newCartData = await createCartResponse.json();
        cartData.userCart = newCartData.userCart;
      }

      let updatedQuantity;

      // Find the product in the user's cart (if it exists)
      const existingProduct = cartData.userCart.products.find(
        (product) => product.productId === productId
      );

      if (existingProduct) {
        // If the product already exists in the cart, increase its quantity
        updatedQuantity = existingProduct.quantity + 1;
      } else {
        // If the product does not exist in the cart, set initial quantity to 1
        updatedQuantity = 1;
      }

      const response = await fetch(
        `http://localhost:4000/users/cart/addToCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify([
            {
              productId: productId,
              quantity: updatedQuantity,
            },
          ]),
        }
      );

      if (response.ok) {
        setProductData((prevProductData) => ({
          ...prevProductData,
          quantity: updatedQuantity,
        }));
        Swal.fire({
          title: "Added to cart",
          icon: "success",
        });
      } else {
        console.error("Failed to add to cart");
        Swal.fire({
          title: "Failed to add to cart",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    console.log(productId);
    //use api get specific product
    fetch(`http://localhost:4000/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setProductData(data);
      });
  }, [productId]);

  return (
    <Container className="mt-5">
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>{productData.name}</Card.Title>
              <Card.Subtitle>Description:</Card.Subtitle>
              <Card.Text>{productData.description}</Card.Text>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>PhP {productData.price}</Card.Text>
              <Card.Subtitle>Class Schedule</Card.Subtitle>
              <Card.Text>8 am - 5 pm</Card.Text>
              {user.id !== null ? (
                <div>
                  <button
                    className="product-view-button"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              ) : (
                <Button
                  className="product-view-button-login"
                  as={NavLink}
                  to="/login"
                >
                  Login to Add to Cart
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
