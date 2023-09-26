// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/userController");
const auth = require('../auth');

const {verify, verifyAdmin} = auth;


// [SECTION] Routing Component
const router = express.Router();

// For Registration
	router.post("/register", (req, res) => {
		userController.registerUser(req.body).then(resultFromController => {
			res.send(resultFromController)
		})
	})

// For Logging-in
	router.post("/login", userController.loginUser);

// For non-admin user checkout
	router.post("/checkout", verify, userController.createOrder);

// Retrieve user details
	router.get("/details", verify, userController.getDetails);


// [SECTION] Export Route System
	// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;