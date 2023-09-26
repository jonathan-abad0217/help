// [SECTION] Dependencies and Modules
const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const bcrypt = require('bcrypt');
const auth = require("../auth");

// Register User
module.exports.registerUser = (reqBody) => {
  const {
    firstName,
    lastName,
    email,
    password,
    mobileNo,
  } = reqBody;
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
    return User.findOne({email : req.body.email}).then(result => {
        // User does not exist
        if(result == null){
            return false;
        // User exists
        }else{
            // Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password)

            // If the passwords match/result of the above code is true
            if(isPasswordCorrect){
                // Generate an access token
                return res.send({access : auth.createAccessToken(result)})
            //Passwords do not match 
            }else {
                return res.send(false);
            }
        }
    }).catch(err => res.send(err))
}

// Non-admin user checkout
// Create a new order
module.exports.createOrder = async (req, res) => {
  // Check if the user is an admin and forbid the action if they are
  if (req.user.isAdmin) {
    return res.status(403).json({ message: "Action Forbidden for Admin Users" });
  }

   try {
      const { userId, products, totalAmount } = req.body;

      // Create an array to store the created orders
      const createdOrders = [];

      // Iterate through the products array and create an order for each product
      for (const product of products) {
        const { productId, quantity } = product;

        // Create a new order document
        const newOrder = new Order({
          userId,
          products: [
            {
              productId,
              quantity,
            },
          ],
          totalAmount,
        });

        // Save the new order to the database
        const createdOrder = await newOrder.save();

        // Add the created order to the array
        createdOrders.push(createdOrder);
      }

      res.status(201).json({
        message: "Orders created successfully",
        data: createdOrders,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating orders",
        error: error.message,
      });
    }
  };

// Retrieve user details
module.exports.getDetails = (req, res) => {

    return User.findById(req.user.id)
    .then(result => {

        result.password = "";

        // Returns the user information with the password as an empty string
        return res.send(result);

    })
    .catch(err => res.send(err))
};