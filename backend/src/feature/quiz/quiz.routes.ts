import { Router } from "express"
import { quizController } from "./quiz.controller"
const quizRouter = Router()

quizRouter.get("/", (req, res) => {
  res.json({ message: "API quiz en ligne" });
});

quizRouter.get("/today", (req, res) => quizController.getTodayQuestions(req, res))
quizRouter.post("/submit", (req, res) => quizController.submitQuiz(req, res))

export { quizRouter }

