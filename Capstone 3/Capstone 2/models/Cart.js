const mongoose = require("mongoose");

const cart_schema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "userId is required"],
  },
  userName: {
    type: String,
    require: [true, "userName is required"],
  },
  products: [
    {
      productId: {
        type: String,
      },
      productName: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      total: {
        type: Number,
      },
      productDescription: {
        type: String,
      },
    },
  ],
  totalAmount: {
    type: Number,
  },
});

const Cart = mongoose.model("Cart", cart_schema);
module.exports = Cart;
