import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeftNav from './LeftNav';
const Login = () => {
  const [studentId, setStudentId] = useState(0);
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const items = [
    {
      href: "/",
      label: "Login",
    },
    {
      href: "/register",
      label: "Register",
    },
  ];
  const navigate = useNavigate();
  const handleLogin = () => {
    const data = {
      studentId:studentId,
      password:password
    };
    const url = "https://localhost:7044/api/Users/login";

    axios.post(url, data)
      .then((result) => {
        const message = result.data;
        alert("OK")
        console.log(result.data.user)
        navigate("./dash")
        localStorage.setItem('id', result.data.user.id);
        localStorage.setItem('name', result.data.user.name);
        localStorage.setItem('sid', result.data.user.studentId);
        // localStorage.setItem('token', result.data.token);
    
        // Automatically close the modal after 5 seconds and navigate
        
      })
      .catch((error) => {
        alert(error);
      });
    
  
  };

  

  return (
    <>
    <LeftNav items={items}/>
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={12}>
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Login</h2>
              <Form>
                <Form.Group controlId="username">
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </Form.Group>
<br/>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
<br/>
                <Button
                  variant="primary"
                  type="button"
                  className="w-100"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Form>
              
            </div>
          </div>
        </Col>
      </Row>
      
    </Container></>
  );
};

export default Login;
