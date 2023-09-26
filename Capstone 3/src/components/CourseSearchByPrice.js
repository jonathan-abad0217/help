import React, { useState } from 'react';
import CourseCard from './CourseCard';

const CourseSearchByPrice = () => {
const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');
const [searchResults, setSearchResults, setSearchClicked] = useState([]);

  const handleSearch= async () => {
     try {
       const response = await fetch('http://localhost:4000/courses/searchByPrice', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ minPrice, maxPrice })
       });

       if (!response.ok) {
         throw new Error('Network response was not ok');
       }

       const data = await response.json();
       const courses = data.courses; // Assuming the courses are inside a 'courses' property
       setSearchResults(courses);
       setSearchClicked(true);
     } catch (error) {
       console.error('Error searching for courses:', error);
     }
   };

 return (
    <div className="pt-5 container">
      <h2>Course Search by Price Range</h2>
      <div className="form-group">
        <label htmlFor="minPrice">Minimum Price:</label>
        <input
          type="number"
          id="minPrice"
          className="form-control"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="maxPrice">Maximum Price:</label>
        <input
          type="number"
          id="maxPrice"
          className="form-control"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />
      </div>
      <button className="btn btn-primary my-4" onClick={handleSearch}>
        Search
      </button>
      <h3>Search Results:</h3>
      <ul>
        {searchResults.map((course) => (
          <CourseCard courseProp={course} key={course._id} />
        ))}
      </ul>
    </div>
  );
};

export default CourseSearchByPrice