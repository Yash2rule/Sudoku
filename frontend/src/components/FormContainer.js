import React from 'react'
import {Container , Row , Col} from 'react-bootstrap';
const FormContainer = ({children}) => {
    return (
        <Container>
            <Row className='justify-content-md-center' style={{marginTop:'50px'}}>
                <Col xs={12} md={6}>
                {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer
