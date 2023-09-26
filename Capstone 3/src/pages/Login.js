import { Form, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import {Navigate} from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';


export default function Login(props) {
    const {user, setUser} = useContext(UserContext);

    // State hooks to store the values of the input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
        fetch('http://localhost:4000/users/login',{

        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({

           email: email,
           password: password

           })
       })
       .then(res => res.json())
       .then(data => {

            console.log(data);

            //if no user information is found, the "access" property will not be available and will return undefined
            //Using the typeof operator will return a string of the data type of the variable/expression it proceeds which is why the value being compared is in a string data type. 
           if(typeof data.access !== "undefined"){
                //Set the email of the authenticated user in the local storage 
                // Storing information in the localStorage will make the data persistent even as the page is refreshed unlike with the use of states where the information is reset when refreshing the page
                // The JWT will be used to retrieve the user information accross the whole frontend application and storing it in the localStorage will allow ease of access to the user's information
                localStorage.setItem('token', data.access);

                // function for retrieving details
                retrieveUserDetails(data.access)

                Swal.fire({
                    title: "Login Successful!",
                    icon: "success",
                    text: "Welcome to Zuitt"
                })

                // Set the global user state to have properties obtained from local storage
                // Though access to the user information can be done via the localStorage this is necessary to update the user state which will help update the app component and rerender it to avoid refreshing the page upon user login and logout
                setUser({
                    access: localStorage.getItem('token')
                })


                alert(`You are now logged in`);
               
           } else {

               Swal.fire({
                title: "Authentication Failed",
                icon: "error",
                text: "Check your login details and try again"
               })
           }
       })
       // Clear input fields after submission
       setEmail('');
       setPassword('');


    }

    const retrieveUserDetails = (token) => {
        // The token will be sent as part of the request's header information
        // We put "Bearer" in front of the token to follow implementation standard for JWT's
        fetch('http://localhost:4000/users/details',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            // Changes the global "user" state to store the "id" and the "isAdmin" property of the user which will be used for validation accross the whole application
            setUser({
                id: data._id,
                isAdmin: data.isAdmin
            })
        })            
    }


    useEffect(() => {

       // Validation to enable submit button when all fields are populated and both passwords match
       if(email !== '' && password !== ''){
           setIsActive(true);
       }else{
           setIsActive(false);
       }

    }, [email, password]);

    return ( 
        (user.id !== null)?
            <Navigate to="/courses"/> 
        :  
            <Form onSubmit={(e) => authenticate(e)}>
               <h1 className="my-5 text-center">Login</h1>
               <Form.Group controlId="userEmail">
                   <Form.Label>Email address</Form.Label>
                   <Form.Control 
                       type="email" 
                       placeholder="Enter email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                   />
               </Form.Group>

               <Form.Group controlId="password">
                   <Form.Label>Password</Form.Label>
                   <Form.Control 
                       type="password" 
                       placeholder="Password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                   />
               </Form.Group>
               { isActive ?
                   <Button variant="primary" type="submit" id="submitBtn">
                       Submit
                   </Button>
                   :
                   <Button variant="primary" type="submit" id="submitBtn" disabled>
                       Submit
                   </Button>
                }
           </Form>
    )
}