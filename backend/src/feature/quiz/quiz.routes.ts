import { Router } from "express"
import { quizController } from "./quiz.controller"
import { authMiddleware } from "../../middlewares/auth.middleware";
const quizRouter = Router()

quizRouter.get("/", authMiddleware, (req, res) => {
  res.json({ message: "Accès autorisé" });
});

quizRouter.get("/today", (req, res) => quizController.getTodayQuestions(req, res))
quizRouter.post("/submit", (req, res) => quizController.submitQuiz(req, res))

export { quizRouter }

