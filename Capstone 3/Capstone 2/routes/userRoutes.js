// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../auth");
const Cart = require("../models/Cart.js");

const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router = express.Router();

// For Registration
router.post("/register", (req, res) => {
  userController.registerUser(req.body).then((resultFromController) => {
    res.send(resultFromController);
  });
});

// For Logging-in
router.post("/login", userController.loginUser);

// // For non-admin user checkout
// router.post("/checkout", verify, userController.createOrder);

// Retrieve user details
router.get("/details", verify, userController.getDetails);

// retrieve authenticated user's order
router.get("/orders", auth.verify, (request, response) => {
  userController.getUserOrders(request, response);
});

// add/edit to cart for authenticated user
router.post("/cart/addToCart", auth.verify, (request, response) => {
  userController.addToCart(request, response);
});

// remove product in cart
router.delete("/cart/:productId", auth.verify, (request, response) => {
  userController.removeFromCart(request, response);
});

// place order/ checkout of the cart of user
router.post("/place-order", auth.verify, (request, response) => {
  userController.placeOrder(request, response);
});

// View user's cart
router.get("/cart/view", auth.verify, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// [SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;
