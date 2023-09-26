//[SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/productController");
const auth = require("../auth");

//[SECTION] Routing Component
const router = express.Router();

const {verify, verifyAdmin} = auth;


//[SECTION] Create a product POST
    router.post("/", verify, verifyAdmin, productController.addProduct);

// [SECTION] Retrieve all products
    router.get("/all", productController.getAllProduct);

// [SECTION]  Get all active products
    router.get("/", productController.getAllActiveProducts);

// [SECTION] Retrieve single product
    router.get("/:productId", productController.getProduct);

// [SECTION] Updating a product
    router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

// [SECTION] Archive a product
    router.put("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// [SECTION] Activate a product
    router.put("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;