// import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'

// export default function Banner() {
//     return (
//         <Row>
//             <Col className='p-5 text-center'>
//                 <h1>Zuitt Coding Bootcamp</h1>
//                 <p>Opportunities for everyone, everywhere.</p>
//                 <Button variant="primary">Enroll now!</Button>
//             </Col>
//         </Row>
//     )
// }

export default function Banner({data}){
    
    console.log(data);
    const {title, content, destination, label} = data;

  return(
    <Row>
           <Col className="p-5 text-center">
                <h1>{title}</h1>
                <p>{content}</p>
                <Link className="btn btn-primary" to={destination}>{label}</Link>
           </Col>
       </Row>
  )

}