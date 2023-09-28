import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

export default function ProductCard({ productProp }) {
  // console.log(props)

  const { _id, name, description, price } = productProp;

  // Use the state hook for this component to be able to store its state
  // States are used to keep track of information related to individual components
  // const [count, setCount] = useState(0);

  // const [seats, setSeats] = useState(10);

  // // The setter function for useStates are asynchronous allowing it to execute seperately
  // // The setCount function is being executed while the "console.log" is already completed resulting in the value to be displayed in the console to be behind by one count
  //    function enroll(){
  //         if (seats > 0) {
  //            setCount(count + 1);
  //            console.log('Enrollees: ' + count);
  //            setSeats(seats - 1);
  //            console.log('Seats: ' + seats)
  //         } else {
  //            alert("No more seats available");
  //        };
  //     }

  return (
    <Col md={3}>
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle>Description:</Card.Subtitle>
          <Card.Text>{description}</Card.Text>
          <Card.Subtitle>Price:</Card.Subtitle>
          <Card.Text>PhP {price}</Card.Text>
          <Link className="btn btn-primary" to={`/products/${_id}`}>
            Details
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}

// Proptypes are used for validating information passed to a component and is a tool normally used to help developers ensure the correct information is passed from the component to the next
ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    pride: PropTypes.number.isRequired,
  }),
};
