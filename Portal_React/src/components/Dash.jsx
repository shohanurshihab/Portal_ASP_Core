import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import LeftNav from './LeftNav';

const Dashboard = () => {
    const items = [
        {
          href: "/profile",
          label: "Profile",
        },
        {
            href: "/logout",
            label: "Logout",
        },
      ];
    const token = localStorage.getItem('token');
    const config = {
        headers: {
        'Authorization': `Bearer ${token}`
        }}
  return (
    <><LeftNav items={items}/>
    <Container>
      <h1>Dashboard</h1>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Profile</Card.Title>
              <Link to="/profile" className="btn btn-primary">
                Profile
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Documents</Card.Title>
              <Link to="/docs" className="btn btn-primary">
                 Documents
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <br/>
        
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>User</Card.Title>
              <Link to="/users" className="btn btn-primary">
                Users
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container></>
  );
};

export default Dashboard;
