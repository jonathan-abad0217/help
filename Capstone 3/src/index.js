import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import bootsrap css
import 'bootstrap/dist/css/bootstrap.min.css';

// createRoot - displays the element to be managed by React with its virtual DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// render() - displays the react elements/components into the root
// App component is our mother component, this is the cmoponent we use as entry point and where we can render all other components or pages
// React.strictmode - component from React that manages future possible conflicts
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// const name = "John Smith";
// const user = {
//   firstName: 'Jane',
//   lastName: 'Doe'
// }

// function formatName(user) {
//   return user.firstName + ' ' + user.lastName;
// }
// const element = <h1>Hello, {formatName(user)}</h1>

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(element);