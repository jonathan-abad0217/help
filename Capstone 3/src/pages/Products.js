// import productsData from '../data/productsData';

import { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import UserView from "../components/UserView";
import AdminView from "../components/AdminView";

export default function Products() {
  // Checks to see if the mock data was captured
  // console.log(productsData);

  // The "course" in the CourseCard component is called a "prop" which is a shorthand for "property"
  // the curly braces ({}) are used for props to signify that we are providing information using JavaScript expressions rather than hard coded values
  // The process of passing information from one component to another is called "props drilling"
  // Multiple components created through the map method must have a unique key that will help React JS indentify which components/elements have been changed, added or removed
  // Everytime the map method loops through the data, it creates a "CourseCard" component and then passes the current element in our productsData array
  // const products = productsData.map(course => {
  //  return(
  //    <>
  //      <CourseCard key={course.id} courseProp={course}/>
  //    </>
  //  )
  // })

  const { user } = useContext(UserContext);

  // State taht will be used to store the products retrieved from the database
  const [products, setproducts] = useState([]);

  const fetchData = () => {
    fetch("http://localhost:4000/products/all")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        // Sets the "products" state to map the data retrieved from the fetch request into several "CourseCard" components
        setproducts(data);
      });
  };

  // Retrieves the products from the database upon initial render of the "products" component
  useEffect(() => {
    fetchData();
  }, []);

  // The "map" method loops through the individual course objects in our array and returns a component for each course
  // Multiple components created through the map method must have a unique key that will help React JS identify which components/elements have been changed, added or removed
  // Everytime the map method loops through the data, it creates a "CourseCard" component and then passes the current element in our productsData array using the courseProp
  // const products = productsData.map(course => {
  //     return (
  //         <CourseCard key={course.id} courseProp={course}/>
  //     );
  // })

  return (
    <>
      {user.isAdmin === true ? (
        <AdminView productsData={products} fetchData={fetchData} />
      ) : (
        <UserView productsData={products} />
      )}
    </>
  );
}
