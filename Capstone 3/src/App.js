import "./App.css";
import { UserProvider } from "./UserContext";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Error from "./pages/Error";
import Profile from "./pages/Profile";
import ProductView from "./pages/ProductView";
import AddProduct from "./pages/AddProduct";
import CartPage from "./pages/CartPage";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

// React JS is a single application
// Whenever a link is clicked, it functions as if the page is being reloaded but what it actually does is it goes through the process of rendering, mounting, rerendering and unmounting components
// When a link is clicked, React JS changes the url of the application to mirrow how HTML accesses its URLs
// It renders the component displaying the elements
// After rendering it mounts the component displaying the elements
// Whenever a state is updated or changes are made with React JS, it rerenders the component
// Lastly, when a different page is loaded, it unmounts the component and repeats this process

function App() {
  // State hook for the user state that's defined here for a global scope
  // Initialized as an object with properties from the localStorage
  // This will be used to store the user information and will be used for validating if a user is logged in the app or not
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  // Function for clearing localStorage on logout
  const unsetUser = () => {
    localStorage.clear();
  };

  // Used to check if the user information is properly stored upon login and the localStorage information is cleared upon logout
  useEffect(() => {
    console.log(user);
    //use to get user details also authorization
    fetch(`http://localhost:4000/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (typeof data._id !== "undefined") {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
          });
          // Else the user state to the initial values
        } else {
          setUser({
            id: null,
            isAdmin: null,
          });
        }
      });
  }, [user]);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <Container fluid>
          <AppNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            {/* change the courseId to productId */}
            <Route path="/products/:productId" element={<ProductView />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
