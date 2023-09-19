import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import LeftNav from './LeftNav';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function DocumentListPage() {
    const [pdfURL, setPDFURL] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [showPDFViewer, setShowPDFViewer] = useState(false);    
const sid = localStorage.getItem('sid')
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState({
    documentId: 0,
    fileName: null,
    filePath: null,
    uploadDate: null,
    studentId: sid,
    file: null,
  });
  const [showPDFViewerModal, setShowPDFViewerModal] = useState(false);
  const openPDFViewerModal = () => {
    setShowPDFViewerModal(true);
  };
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const items = [
    {
      href: "/dash",
      label: "Dashboard",
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

    const [documentId, setDocumentId] = useState(0);
    const [studentId, setStudentId] = useState(sid);
    const [file, setFile] = useState(null);
  ;
  const [showModal, setShowModal] = useState(false);
  const [updateDocument, setUpdateDocument] = useState(null); // To track the document being updated
  const [showUpdateModal, setShowUpdateModal] = useState(false); // To control the update modal visibility
  const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
    }
}
  const handleUpdate = (document) => {
    setUpdateDocument(document);
    setShowUpdateModal(true);
    console.log(document)
  };
  const handleDelete = (document) => {
    if (window.confirm(`Are you sure you want to delete ${document.fileName}?`)) {
      axios
        .delete(`https://localhost:7044/api/Documents/${document.documentId}`)
        .then(() => {
          // Remove the deleted document from the state
          setDocuments((prevDocuments) =>
            prevDocuments.filter((doc) => doc.documentId !== document.documentId)
          );
          console.log('Document deleted successfully.');
        //   window.location.reload();
        })
        .catch((error) => {
          console.error('Error deleting document: ', error);
        });
    }
  };
  
  
  useEffect(() => {
    axios
      .get(`https://localhost:7044/api/Documents/user/${sid}`)
      .then((response) => {
        setDocuments(response.data.$values);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching documents: ', error);
      });
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setNewDocument({
      documentId: '',
      fileName: '',
      filePath: '',
      uploadDate: '',
      studentId: '',
      file: null,
    });
  };

  const handleShow = () => {
    setShowModal(true);
  };

  

  const handleFileChange = (e) => {
    const selectedfile = e.target.files[0];
      setDocumentId(0);
      setStudentId(sid);
      setFile(selectedfile);
  };

  const handleInsert = () => {
    const formData = {
    documentId: 0,
    studentId: sid,
    file: file,
}
    

    axios
      .post('https://localhost:7044/api/Documents', formData, config)
      .then((response) => {
        console.log('Document inserted:', response.data);
        handleClose();
        window.location.reload();
        // You may want to update the document list by fetching it again
      })
      .catch((error) => {
        console.error(error);
        console.log(formData);
      });
  };

  const handleCloseUpdate = () => {
    setUpdateDocument(null);
    setShowUpdateModal(false);
  };
  
  const handleUpdateFileChange = (e) => {
    const updatedFile = e.target.files[0];
    setFile(updatedFile);
  };
  const handleSelectDocument = (documentId) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };
  
  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete the selected documents?`)) {
      // Iterate over selectedDocuments and delete each document
      selectedDocuments.forEach((documentId) => {
        axios
          .delete(`https://localhost:7044/api/Documents/${documentId}`)
          .then(() => {
            // Remove the deleted document from the state
            setDocuments((prevDocuments) =>
              prevDocuments.filter((doc) => doc.documentId !== documentId)
            );
            console.log(`Document ${documentId} deleted successfully.`);
          })
          .catch((error) => {
            console.error('Error deleting document: ', error);
          });
      });
  
      // Clear the selected documents
      setSelectedDocuments([]);
    }
  };
  
  const handlePerformUpdate = () => {
    const formData = {
        documentId : updateDocument.documentId,
        studentId : updateDocument.studentId,
        file : file
    }

  
    // Use the appropriate API endpoint for updating the document
    // You may need to adjust the API call according to your backend
    axios
      .put(`https://localhost:7044/api/Documents`, formData, config)
      .then((response) => {
        console.log('Document updated:', response.data);
        alert(`Updated ${updateDocument.documentId}`)
        handleCloseUpdate();
        window.location.reload();
        // You may want to update the document list by fetching it again
      })
      .catch((error) => {
        console.error('Error updating document: ', error, formData);
      });
  };
  

  const handleLoadPDF = async (document) => {
    // Set the PDF URL based on the selected document
    const pdfURL = `https://localhost:7044/api/Documents/${document.documentId}`;

    try {
      const response = await axios.get(pdfURL, { responseType: 'blob' });
      const blobURL = URL.createObjectURL(new Blob([response.data]));
      setPDFURL(blobURL);
      setShowPDFViewer(true);
      setShowPDFViewerModal(true);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const downloadPDF = (doc1) => {
    const pdfURL = `https://localhost:7044/api/Documents/${doc1.documentId}`;
    const response =  axios.get(pdfURL, { responseType: 'blob' });
    const blobURL = URL.createObjectURL(new Blob([response.data]));
    setPDFURL(blobURL);
    if (pdfURL) {
      const link = document.createElement('a');
      link.href = pdfURL;
      link.download = doc1.fileName;
      link.click();
    }
  };

  return (
    <>
    <LeftNav items={items}/>
    <div className="container mt-5">
      <h1 className="mb-4">Document List</h1>
      <button className="btn btn-primary mb-3" onClick={handleShow}>
        New Document
      </button>
      <button className="btn btn-danger mb-3" onClick={handleDeleteSelected}>
        Delete Selected
        </button>

      <ul className="list-group">
  {documents.map((document) => (
    <li
      key={document.documentId}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
    <input
      type="checkbox"
      onChange={() => handleSelectDocument(document.documentId)}
    />
      {document.documentId}.&nbsp;  
      {document.fileName}
      <div>
        <button
          className="btn btn-success ml-2"
          onClick={() => handleLoadPDF(document)}
        >
          Load PDF
        </button>
        <button
          className="btn btn-primary ml-2"
          onClick={() => handleUpdate(document)} // Open the update modal
        >
          Update
        </button>
        <button
          className="btn btn-danger ml-2"
          onClick={() => handleDelete(document)}
        >
          Delete
        </button>
        <button
          className="btn btn-primary ml-2"
          onClick={() => downloadPDF(document)}
        >
          Download
        </button>
      </div>
    </li>
  ))}
</ul>


      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insert New Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="file">
              <Form.Label>Select File</Form.Label>
              <Form.Control type="file" name="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleInsert}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showUpdateModal} onHide={handleCloseUpdate}>
  <Modal.Header closeButton>
    <Modal.Title>Update Document</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="updateFile">
        <Form.Label>Select File to Update</Form.Label>
        <Form.Control type="file" name="file" onChange={handleUpdateFileChange} />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseUpdate}>
      Close
    </Button>
    <Button variant="primary" onClick={handlePerformUpdate}>
      Update
    </Button>
  </Modal.Footer>
</Modal>
<Modal show={showPDFViewerModal} onHide={() => setShowPDFViewerModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>PDF Viewer</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* PDF viewer code here */}
    {pdfURL && (
      <div className="mt-5">
        <Document file={pdfURL} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={450} // Set the width (adjust as needed)
              height={400} // Set the height (adjust as needed)
            />
          ))}
        </Document>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowPDFViewerModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </div>
    </>
  );
}

export default DocumentListPage;
