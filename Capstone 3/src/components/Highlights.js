import { Row, Col, Card } from 'react-bootstrap';

export default function Highlights() {
    return (
        <Row className="mt-3 mb-3">
            <Col xs={12} md={4}>
                <Card className="cardHighlight p-3">
                    <Card.Body>
                        <Card.Title>
                            <h2>Wide Selection</h2>
                        </Card.Title>
                        <Card.Text>
                            Explore our extensive collection of shoes, including sneakers, boots, sandals, and more, for every style and occasion. 
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={12} md={4}>
                <Card className="cardHighlight p-3">
                    <Card.Body>
                        <Card.Title>
                            <h2>Quality Materials</h2>
                        </Card.Title>
                        <Card.Text>
                            Our shoes are crafted from premium materials, ensuring comfort, durability, and style that lasts.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={12} md={4}>
                <Card className="cardHighlight p-3">
                    <Card.Body>
                        <Card.Title>
                            <h2>Customer-Centric Service</h2>
                        </Card.Title>
                        <Card.Text>
                            We pride ourselves on excellent customer service, offering hassle-free returns and expert assistance to find your perfect fit.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};