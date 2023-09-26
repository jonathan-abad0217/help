// [SECTION]Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");


// [SECTION]Environment Setup
const port = 4000;

// [SECTION]Server Setup
const app = express();

//Middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);


// [SECTION] Database connection
mongoose.connect("mongodb+srv://bautistajoshua843:admin123@course-booking.3lg0kxw.mongodb.net/s49-s53?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
// Prompts a message in the terminal once the connection is "open" and we are ablt to successfully connect to our database
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));


// [SECTION]Server gateway response
if(require.main === module){
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${process.env.PORT || port}`)
	})
}

// export mongoose only for checking
module.exports = {app, mongoose};