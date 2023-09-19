import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeftNav from './LeftNav';

const RegisterForm = ({ history }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState(0);
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
      setPhoto(selectedPhoto);
    };
  
    
  
  const handleRegister = (e) => {
    e.preventDefault();
    const data = {
    id:0,
    name:name,
    studentId:studentId,
    password:password,
    pics:photo,
    uploadedDocuments:null
  };
  

// Or from localStorage
const token = localStorage.getItem('token');

const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
};


  const url = "https://localhost:7044/api/Users";
  axios.post(url,data,config).then((result)=>{
    if(result.status===204){ 
        console.log(data)
        alert("Registration Succesfull");
        navigate("/");
    };
  }).catch((error)=>{
    console.log(data)
    alert(error);})
  };
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
  return (
    <><LeftNav items={items}/>
     <Container>
    <Row className="justify-content-center">
      <Col md={12}>
        <div className="card shadow">
           <div className="card-body p-5">
                <h2 className="text-center mb-4">Product</h2>
                    <Form autoComplete='off' encType='multipart/form-data'>
                        <Form.Group className="mb-3" >
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Student Id</Form.Label>
                            <Form.Control type="text" placeholder="Student Id" onChange={(e) => setStudentId(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Image</Form.Label>
                            <Form.Control 
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange} 
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={handleRegister}>
                            Submit
                        </Button>
                    </Form>
            </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterForm;
