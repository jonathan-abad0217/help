import React, { useState, useEffect } from "react";
import { Row, Dropdown } from "react-bootstrap";
import ProductCard from "./ProductCard";
// import CourseSearch from "./CourseSearch";
// import CourseSearchByPrice from "./CourseSearchByPrice";

export default function UserView({ productsData }) {
  const [products, setProducts] = useState([]);

  //   useEffect(() => {
  //     const productsArr = productsData.map((product) => {
  //       //only render the active products
  //       if (product.isActive === true) {
  //         return <ProductCard productProp={product} key={product._id} />;
  //       } else {
  //         return null;
  //       }
  //     });

  //     //set the products state to the result of our map function, to bring our returned product component outside of the scope of our useEffect where our return statement below can see.
  //     setProducts(productsArr);
  //   }, [productsData]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchOption, setSearchOption] = useState("name");

  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const activeProducts = filteredProducts.filter((product) => product.isActive);
  const productCards = activeProducts.map((product) => (
    <ProductCard key={product._id} productProp={product} />
  ));

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
  }, [productsData]);

  useEffect(() => {
    const filteredByName = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredByPrice = products.filter(
      (product) =>
        (minPrice === "" || product.price >= minPrice) &&
        (maxPrice === "" || product.price <= maxPrice)
    );

    const combinedFiltered = filteredByName.filter((product) =>
      filteredByPrice.includes(product)
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
  }, [searchTerm, minPrice, maxPrice, products, sortCriteria, sortDirection]);

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
              variant="primary"
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
              variant="primary"
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

      <Row className="mb-5 mt-2">{productCards}</Row>
    </>
  );
}
