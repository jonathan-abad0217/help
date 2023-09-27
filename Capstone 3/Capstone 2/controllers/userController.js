// [SECTION] Dependencies and Modules
const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order.js");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// Register User
module.exports.registerUser = (reqBody) => {
  const { firstName, lastName, email, password, mobileNo } = reqBody;
  const hashedPassword = bcrypt.hashSync(password, 10);

  let newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    mobileNo,
  });
  return newUser
    .save()
    .then((registeredUser, error) => {
      if (error) {
        return {
          message: error.message,
        };
      }
      return {
        message: "User registered successfully",
        data: registeredUser,
      };
    })
    .catch((error) => console.log(error));
};

// Login User
module.exports.loginUser = (req, res) => {
  return User.findOne({ email: req.body.email })
    .then((result) => {
      // User does not exist
      if (result == null) {
        return false;
        // User exists
      } else {
        // Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );

        // If the passwords match/result of the above code is true
        if (isPasswordCorrect) {
          // Generate an access token
          return res.send({ access: auth.createAccessToken(result) });
          //Passwords do not match
        } else {
          return res.send(false);
        }
      }
    })
    .catch((err) => res.send(err));
};

// Non-admin user checkout
// Create a new order
// module.exports.createOrder = async (req, res) => {
//   // Check if the user is an admin and forbid the action if they are
//   if (req.user.isAdmin) {
//     return res
//       .status(403)
//       .json({ message: "Action Forbidden for Admin Users" });
//   }

//   try {
//     const { userId, products, totalAmount } = req.body;

//     // Create an array to store the created orders
//     const createdOrders = [];

//     // Iterate through the products array and create an order for each product
//     for (const product of products) {
//       const { productId, quantity } = product;

//       // Create a new order document
//       const newOrder = new Order({
//         userId,
//         products: [
//           {
//             productId,
//             quantity,
//           },
//         ],
//         totalAmount,
//       });

//       // Save the new order to the database
//       const createdOrder = await newOrder.save();

//       // Add the created order to the array
//       createdOrders.push(createdOrder);
//     }

//     res.status(201).json({
//       message: "Orders created successfully",
//       data: createdOrders,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating orders",
//       error: error.message,
//     });
//   }
// };

// Retrieve user details
module.exports.getDetails = (req, res) => {
  return User.findById(req.user.id)
    .then((result) => {
      result.password = "";

      // Returns the user information with the password as an empty string
      return res.send(result);
    })
    .catch((err) => res.send(err));
};

// get orders of users that is authenticated
module.exports.getUserOrders = async (request, response) => {
  const userId = request.user.id;

  try {
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return response.json({ message: "No orders found for the user" });
    }
    response.json({
      message: "User's orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
};

// Update or add to cart
module.exports.addToCart = async (request, response) => {
  if (request.user.isAdmin) {
    return response.status(403).json({
      message: "Action Forbidden",
    });
  }
  const userId = request.user.id;
  const productsToUpdate = request.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [],
        totalAmount: 0,
      });
    }

    for (const productInfo of productsToUpdate) {
      const { productId, quantity } = productInfo;
      const product = await Product.findById(productId);

      if (!product) {
        return response.status(404).json({
          error: `Product with ID ${productId} not found`,
        });
      }

      const existingProduct = cart.products.find(
        (p) => p.productId === productId
      );

      if (existingProduct) {
        // Update existing product's quantity and total
        cart.totalAmount -= existingProduct.total;
        existingProduct.quantity = quantity;
        existingProduct.total = product.price * quantity;
        cart.totalAmount += existingProduct.total;
      } else {
        // Add new product to cart
        const total = product.price * quantity;
        cart.products.push({
          productId,
          productName: product.name,
          quantity,
          total,
          productImageUrl: product.imageUrl,
          productDescription: product.description,
        });
        cart.totalAmount += total;
      }
    }

    await cart.save();

    return response.json({
      message: "Cart updated successfully",
      userCart: cart,
      totalPerProduct: cart.products.map((product) => ({
        productId: product.productId,
        total: product.total,
      })),
      totalPrice: cart.totalAmount,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: "Internal server error",
    });
  }
};

// Remove product from Cart
module.exports.removeFromCart = async (request, response) => {
  const userId = request.user.id;
  const { productId } = request.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return response.send({
        message: "Cart not found",
      });
    }
    const removedProduct = cart.products.find((p) => p.productId === productId);
    if (!removedProduct) {
      return response.send({
        error: `Product with ID ${productId} not found in the cart`,
      });
    }
    cart.totalAmount -= removedProduct.total;
    cart.products = cart.products.filter((p) => p.productId !== productId);

    await cart.save();

    return response.send({
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: "Internal server error",
    });
  }
};

// Place order when user is ready to checkout, the cart of the user will be cleared after checkout and saved in order model
module.exports.placeOrder = async (request, response) => {
  const userId = request.user.id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return response.status(400).json({ error: "Cart is empty" });
    }

    // Fetch the user's name from the database
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Create an order from the cart
    const order = new Order({
      userId,
      userName: user.name, // Include the user's name
      products: cart.products,
      totalAmount: cart.totalAmount,
    });

    // Clear the user's cart
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();

    // Save the order
    await order.save();
    console.log(order);
    response
      .status(201)
      .json({ message: "Order placed successfully", data: order });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
};
