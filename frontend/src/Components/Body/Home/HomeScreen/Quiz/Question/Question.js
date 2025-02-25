import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";
import "./Question.css"; // Unique styles for this page

export const Question = ({ questions, setUserAnswer,setTimeDuration }) => {
  const { id } = useParams(); // Get quiz ID from URL
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [age, setAge] = useState("");
  const [isAgeRequired, setIsAgeRequired] = useState(false);

  const handleAnswerSelect = (index) => {
    // Set the selected answer for the current question
    setSelectedAnswer(index);

    // Update the userAnswer map with the selected answer
    const questionId = questions[currentQuestion].id;
    console.log(questions)
    setUserAnswer((prevUserAnswer) => ({
      ...prevUserAnswer,
      [questionId]: questions[currentQuestion].Answers[index].id, // Map questionId to the selected answer index
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null); // Reset selected answer for the next question
    } else {
      setTimeDuration((prevData) => {
        return {
          ...prevData,
          endTime: new Date(),
        };
      });
      setIsAgeRequired(true);
    }
  };

  const handleSubmit = () => {
    
    if (!age) {
      alert("Please enter your age before submitting.");
      return;
    }else{
      setUserAnswer((prevUserAnswer) => ({
        ...prevUserAnswer,
        ['age']: age, // Map questionId to the selected answer index
      }));
    }
    navigate(`/quiz/${id}/result`);
  };

  if (questions.length === 0) {
    return (
      <>
        <h1>No Questions Found</h1>
      </>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Container className="question-container">
      <Card className="question-card">
        {!isAgeRequired ? (
          <>
            <Card.Body>
              {currentQ.text && (
                <Card.Title className="question-title">
                  {currentQuestion + 1}. {currentQ.text}
                </Card.Title>
              )}
              {currentQ.image && (
                <div className="question-image">
                  <img src={currentQ.image} alt="Question" />
                </div>
              )}
              <hr />
              <div className="question-options">
                {currentQ.Answers.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedAnswer === index ? "success" : "outline-primary"
                    }
                    className="question-option"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={`Option ${index + 1}`}
                        className="option-image"
                      />
                    ) : (
                      option.text
                    )}
                  </Button>
                ))}
              </div>
            </Card.Body>
            <Card.Footer className="question-footer">
              <Button
                variant="primary"
                className="next-button"
                onClick={handleNext}
              >
                {currentQuestion === questions.length - 1
                  ? "Finish Quiz"
                  : "Next"}
              </Button>
            </Card.Footer>
          </>
        ) : (
          <Card.Body>
            <Card.Title className="question-title">Enter Your Age</Card.Title>
            <Form.Group>
              <Form.Control
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="age-input"
              />
            </Form.Group>
            <Button
              variant="success"
              className="submit-button"
              onClick={handleSubmit}
            >
              Submit & Get Result
            </Button>
          </Card.Body>
        )}
      </Card>
    </Container>
  );
};