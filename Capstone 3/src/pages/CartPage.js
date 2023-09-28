import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Row, Col } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/users/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchCartData(); // Refresh cart data after removing a product
      } else {
        console.error("Failed to remove product from cart");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
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
              quantity: newQuantity,
            },
          ]),
        }
      );

      if (response.ok) {
        fetchCartData(); // Refresh cart data after updating quantity
      } else {
        console.error("Failed to update product quantity");
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  const fetchCartData = () => {
    fetch(`http://localhost:4000/users/cart/view`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCart(data);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(`http://localhost:4000/users/place-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const userResponse = await fetch(
          `http://localhost:4000/users/details`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const userData = await userResponse.json();
        console.log(userData);

        setUser(userData);
        fetchCartData(); // Refresh cart data after placing the order
        Swal.fire({
          title: "Success!",
          icon: "success",
          text: "Order Placed! Thank you!",
        });
        navigate("/");
      } else {
        Swal.fire({
          title: "Error!",
          icon: "error",
          text: "Error placing order. Try again.",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div>
      <Row className="align-content-center justify-content-center">
        <Col md={7} className="cart-col1">
          <h1 className="ml-5 mt-5">Cart</h1>
          {cart && cart.products ? (
            <div className="ml-5">
              {cart.products.map((product) => (
                <Row key={product.productId} className="product-row">
                  <Col md={2}>{/* Product Image */}</Col>
                  <Col md={4}>
                    <div className="product-details">
                      <div className="cart-title">{product.productName}</div>
                      <em>
                        <p className="cart-description">
                          {product.productDescription}
                        </p>
                      </em>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="product-details">
                      <div>Total Product Price: ₱{product.total}</div>
                    </div>
                  </Col>
                  <Col md={3} className="col3">
                    <div className="product-details">
                      <div className="input-remove-container">
                        <div className="quantity-input">
                          <button
                            className=" quantity-button-minus btn btn-secondary text-center"
                            onClick={() =>
                              handleUpdateQuantity(
                                product.productId,
                                product.quantity - 1
                              )
                            }
                            disabled={product.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="quantity-text">
                            {product.quantity}
                          </span>
                          <button
                            className="quantity-button-add btn btn-secondary text-center"
                            onClick={() =>
                              handleUpdateQuantity(
                                product.productId,
                                product.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="remove-button-container">
                          <button
                            className="btn btn-secondary remove-button"
                            onClick={() =>
                              handleRemoveFromCart(product.productId)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
        </Col>
        <Col md={5} className="cart-col2 text-center">
          <div className="total-container">
            <h3 className="cart-total">
              Total Cart Price: ₱{cart ? cart.totalAmount : 0}
            </h3>
            <p className="total-text mt-4">
              By clicking this, you will place your order and clear your Cart
            </p>
            <button onClick={handlePlaceOrder} className="total-button">
              Place Order
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CartPage;
