import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./QuestionHome.css"; // Unique CSS for this page
import { createHandler, quizHandler } from "../../apiHandler";
import { useAlert } from "../../../../../../../UI/Alert/AlertContext";

export const QuestionHome = () => {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "text",
    weight: "",
  });
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const { showAlert } = useAlert();
  const [details, setDetails] = useState({
    id: "",
    totalQuestions: 0,
    isActive: false, // Added isActive state for the quiz
  });
  const [dataUpdated, setDataUpdated] = useState(0);
  const [isActivating, setIsActivating] = useState(false); // Loading state for activate/deactivate
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, [dataUpdated]);

  const fetchDetails = async () => {
    const response = await quizHandler(
      { quizId: params.id },
      "getQuiz",
      setIsLoading,
      showAlert
    );

    if (response) {
      setQuestions(response.questions);
      setDetails({
        id: response.quiz.id,
        totalQuestions: response.questions.length,
        isActive: response.quiz.isActive || false, // Set isActive from the response
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("quizId", params.id);
    formData.append("text", newQuestion.text);
    formData.append("type", newQuestion.type);
    formData.append("weight", newQuestion.weight);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const response = await createHandler(
      formData,
      "createQuestion",
      setIsSubmitting,
      showAlert
    );

    if (response) {
      setDataUpdated(dataUpdated + 1);
      setNewQuestion({ text: "", type: "text", weight: "" }); // Reset form
      setSelectedImage(null); // Clear selected image
      setShowForm(false); // Hide form after submission
    }
  };

  const handleToggleActive = async () => {
   
    const response = await quizHandler(
      { quizId: params.id, isActive: !details.isActive },
      "updateQuiz",
      setIsActivating,
      showAlert
    );
    if (response) {
      setDetails((prev) => ({ ...prev, isActive: !prev.isActive }));
    }
   
    
  };

  const handleDeleteQuiz = async () => {
    setIsDeleting(true);
    const response = await quizHandler(
      { quizId: params.id },
      "deleteQuiz",
      setIsLoading,
      showAlert
    );
    if (response) {
      // Redirect to quizzes list or handle deletion success
      navigate("/admin/quiz"); // Example redirect
    }
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading Details...</p>
      </div>
    );
  }

  return (
    <Container className="question-home">
      {/* Quiz Status Section */}
      <Row className="quiz-status">
        <Col md={6}>
          <h4>Quiz ID: {details.id}</h4>
          <p>Total Questions: {details.totalQuestions}</p>
        </Col>
        <Col md={6} className="quiz-actions">
          <Button
            variant={details.isActive ? "danger" : "success"}
            className="quiz-action-btn"
            onClick={handleToggleActive}
            disabled={isActivating}
          >
            {isActivating ? (
              <Spinner animation="border" size="sm" />
            ) : details.isActive ? (
              "Deactivate Quiz"
            ) : (
              "Activate Quiz"
            )}
          </Button>
          <Button
            variant="danger"
            className="quiz-action-btn"
            onClick={handleDeleteQuiz}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Delete Quiz"
            )}
          </Button>
        </Col>
      </Row>

      {/* Create Question Button */}
      <Row>
        <Col className="text-center">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            Create Question
          </Button>
        </Col>
      </Row>

      {/* Create Question Form */}
      {showForm && (
        <Row className="question-form">
          <Col md={8} className="mx-auto">
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group controlId="questionText">
                    <Form.Label>Question Text (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="text"
                      value={newQuestion.text}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Image (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="questionType">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={newQuestion.type}
                      onChange={handleChange}
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="both">Both</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group controlId="questionWeight">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      name="weight"
                      value={newQuestion.weight}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button
                    variant="success"
                    onClick={handleCreateQuestion}
                    className="mt-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Spinner size="sm" /> : "Create Question"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Question List */}
      <Row className="question-list">
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Text</th>
                <th>Image</th>
                <th>Type</th>
                <th>Weight</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.text || "N/A"}</td>
                  <td>
                    {question.imageUrl ? (
                      <img
                        src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${question.imageUrl}`}
                        alt="Question"
                        height="100"
                        width="auto"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{question.type}</td>
                  <td>{question.weight}</td>
                  <td>
                    <Link
                      to={`./question/${question.id}`}
                      className="view-more-btn"
                    >
                      View More
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
