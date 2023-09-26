const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId:{
		type:String,
		required: [true, "Required userId"],
	},
	products: [
		{
			productId:{
				type:String,
				required:true,
			},
			quantity:{
				type:Number,
				required:true,
				min: 1
			},
		}
	],
	totalAmount: {
		type:String,
		required:true,
		min: 0
	},
	isActive:{
		type:Boolean,
		default:true
	},
	purchasedOn:{
		type:Date,
		default: new Date()
	}
	
});

//[SECTION] Model
module.exports = mongoose.model("Order", orderSchema);