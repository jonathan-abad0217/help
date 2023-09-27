import React, { useState, useEffect } from "react";
import { Row, Dropdown } from "react-bootstrap";
import CourseCard from "./CourseCard";
// import CourseSearch from "./CourseSearch";
// import CourseSearchByPrice from "./CourseSearchByPrice";

export default function UserView({ coursesData }) {
  const [courses, setCourses] = useState([]);

  //   useEffect(() => {
  //     const coursesArr = coursesData.map((course) => {
  //       //only render the active courses
  //       if (course.isActive === true) {
  //         return <CourseCard courseProp={course} key={course._id} />;
  //       } else {
  //         return null;
  //       }
  //     });

  //     //set the courses state to the result of our map function, to bring our returned course component outside of the scope of our useEffect where our return statement below can see.
  //     setCourses(coursesArr);
  //   }, [coursesData]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchOption, setSearchOption] = useState("name");

  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const activeProducts = filteredProducts.filter((course) => course.isActive);
  const courseCards = activeProducts.map((course) => (
    <CourseCard key={course._id} courseProp={course} />
  ));

  useEffect(() => {
    setCourses(coursesData);
    setFilteredProducts(coursesData);
  }, [coursesData]);

  useEffect(() => {
    const filteredByName = courses.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredByPrice = courses.filter(
      (course) =>
        (minPrice === "" || course.price >= minPrice) &&
        (maxPrice === "" || course.price <= maxPrice)
    );

    const combinedFiltered = filteredByName.filter((course) =>
      filteredByPrice.includes(course)
    );

    const sortedProducts = combinedFiltered.sort((a, b) => {
      if (sortCriteria === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortCriteria === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });

    setFilteredProducts(sortedProducts);
  }, [searchTerm, minPrice, maxPrice, courses, sortCriteria, sortDirection]);

  const handleSortChange = (criteria) => {
    if (criteria === sortCriteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortDirection("asc");
    }
  };
  const handleDropdownSelect = (eventKey) => {
    setSearchOption(eventKey);
  };

  return (
    <>
      <div className="mt-4">
        <div className="custom-container">
          <Dropdown onSelect={handleSortChange} className="mr-2">
            <Dropdown.Toggle
              variant="secondary"
              id="sort-dropdown"
              className="dropdown"
            >
              Sort by {sortCriteria === "name" ? "Name" : "Price"} (
              {sortDirection === "asc" ? "Asc" : "Desc"})
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="name">Sort by Name (Asc)</Dropdown.Item>
              <Dropdown.Item eventKey="name">Sort by Name (Desc)</Dropdown.Item>
              <Dropdown.Item eventKey="price">
                Sort by Price (Asc)
              </Dropdown.Item>
              <Dropdown.Item eventKey="price">
                Sort by Price (Desc)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown onSelect={handleDropdownSelect} className="mr-2">
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              className="dropdown"
            >
              {searchOption === "name"
                ? "Search by name"
                : "Search by price range"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="name">Search by name</Dropdown.Item>
              <Dropdown.Item eventKey="price">
                Search by price range
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {searchOption === "name" && (
            <input
              type="text"
              placeholder="Search products by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-input-name"
            />
          )}
          {searchOption === "price" && (
            <div className="custom-input-group">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="custom-input-price mr-2"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="custom-input-price"
              />
            </div>
          )}
        </div>
      </div>

      <Row className="mb-5 mt-2">{courseCards}</Row>
    </>
  );
}
