import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios"; // Import Axios
import LeftNav from "./LeftNav";
import Image from './Image';
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [name, setUsername] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const sid = localStorage.getItem('sid');
  const uid = localStorage.getItem('id');
  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
      setPhoto(selectedPhoto);
    };
  const items = [
    {
      href: "/dash",
      label: "Dashboad",
    },
    {
      href: "/profile",
      label: "Profile",
    },
    {
      href: "/logout",
      label: "Logout",
    },
  ];
  const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
    }
  }
  useEffect(() => {
    // Fetch user profile data from the API
    axios.get(`https://localhost:7044/api/Users/${sid}`) // Replace with your API endpoint
      .then((response) => {
        const userData = response.data.user;
        // Update the state variables with the fetched data
        setId(userData.id);
        setUsername(userData.name);
        setStudentId(userData.studentId);
        setPassword(userData.password)
        setPhoto(response.data.fileContentResult.fileContents);
        // Set loading to false once data is fetched
        setLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
        id:uid,
        name:name,
        studentId:studentId,
        password:password,
        pics:photo,
        uploadedDocuments:null
    }

    axios
      .put(`https://localhost:7044/api/Users`, formData, config)
      .then((result) => {
        if (result.status === 204) {
          window.location.reload();
        }
      })
      .catch((error) => {
        alert(error);
        
      });
  };

  if (loading) {
    // You can render a loading indicator here while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <>
    <LeftNav items={items}/>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={5}>
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Update</h2>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  
                {photo && <Image imageData={photo} />}
                <Form.Group>
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      id="custom-file"
                      label="Choose a profile picture"
                      accept="image/*"
                      type="file"
                      onChange={handlePhotoChange} 
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.includes("Username is required") && (
                      <Alert variant="danger">Username is required</Alert>
                    )}
                  </Form.Group>
                  <br></br>
                  <Form.Group>
                    <Form.Label>Student Id</Form.Label>
                    <Form.Control
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </Form.Group>
                  <br></br>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.includes("Password is required") && (
                      <Alert variant="danger">Password is required</Alert>
                    )}
                  </Form.Group>
                  <br></br>
                  <Button type="submit">Update Profile</Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
