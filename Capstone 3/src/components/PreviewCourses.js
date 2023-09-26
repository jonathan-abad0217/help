import React from 'react'
import {Col, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function Product(props){
	// Props is used here to get the data and breakPoint from the FeaturedCourses.js
	const {breakPoint, data} = props

	const{_id, name, description, price} = data

	return(

		<Col xs={12} md={breakPoint}>
            {/*Adding the class cardHighlight for min-height*/}
            <Card className="cardHighlight mx-2">
                <Card.Body>
                    <Card.Title className="text-center">
                        <Link to={`/courses/${_id}`}>{name}</Link>
                    </Card.Title>
                    <Card.Text>description</Card.Text>
                    
                </Card.Body>
                <Card.Footer>
                    <h5 className="text-center">₱{price}</h5>
                    <Link className="btn btn-primary d-block" to={`/courses/${_id}`}>Details</Link>
                </Card.Footer>
            </Card>
        </Col>
	)
}