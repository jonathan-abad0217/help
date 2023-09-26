const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name:{
		type:String,
		required: [true, "Name is required for the product"],
	},
	description:{
		type: String,
		required: [true, "Description is required for the product"],
	},
	price:{
		type:Number,
		required: [true, "Price is required for the product"]
	},
	isActive:{
		type:Boolean,
		default:true,
	},
	createdOn:{
		type: Date,
		default: new Date()
	},
});

//[SECTION] Model
module.exports = mongoose.model("Product", productSchema);