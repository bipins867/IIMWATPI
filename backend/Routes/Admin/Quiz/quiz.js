const express = require("express");

const quizController = require("../../../Controller/Admin/Quiz/quiz");

const { fileHandlerRouter } = require("../../FileHandler/fileHandler");

const router = express.Router();


router.post("/createQuiz", fileHandlerRouter("image", 0.2), quizController.createQuiz);
router.post("/createQuestion", fileHandlerRouter("image", 0.2), quizController.createQuestion);
router.post("/createAnswer",fileHandlerRouter("image", 0.2), quizController.createAnswer);


router.post('/getQuizzes',quizController.getQuizzes)
router.post('/getQuestions',quizController.getQuestions)
router.post('/getAnswers',quizController.getAnswers)


router.post('/deleteQuiz',quizController.deleteQuiz)
router.post('/deleteQuestion',quizController.deleteQuestion)
router.post('/deleteAnswer',quizController.deleteAnswer)




module.exports = router;
