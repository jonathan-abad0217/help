const Product = require("../models/Product");

// Add Products
module.exports.addProduct = (req, res) => {
  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });

  // Saves the created object to our database
  return newProduct
    .save()
    .then((product, error) => {
      // Product creation successfull
      if (error) {
        return res.send(false);

        // Product creation failed
      } else {
        return res.send(true);
      }
    })
    .catch((err) => res.send(err));
};

// Retrieve All Products
module.exports.getAllProduct = (req, res) => {
  return Product.find({}).then((result) => {
    return res.send(result);
  });
};

// Get all active products
module.exports.getAllActiveProducts = (req, res) => {
  return Product.find({ isActive: true }).then((result) => {
    return res.send(result);
  });
};

// Get specific product
module.exports.getProduct = (req, res) => {
  return Product.findById(req.params.productId).then((result) => {
    return res.send(result);
  });
};

// Update Product
module.exports.updateProduct = (req, res) => {
  let updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };

  return Product.findByIdAndUpdate(req.params.productId, updatedProduct).then(
    (product, error) => {
      if (error) {
        return res.send(false);
      } else {
        return res.send(true);
      }
    }
  );
};

// Archive a Product
module.exports.archiveProduct = (req, res) => {
  return Product.findByIdAndUpdate(req.params.productId, {
    isActive: false,
  }).then((product, error) => {
    if (error) {
      return res.send(false);
    } else {
      return res.send(true);
    }
  });
};

// Activate Product
module.exports.activateProduct = (req, res) => {
  return Product.findByIdAndUpdate(req.params.productId, {
    isActive: true,
  }).then((product, error) => {
    if (error) {
      return res.send(false);
    } else {
      return res.send(true);
    }
  });
};
