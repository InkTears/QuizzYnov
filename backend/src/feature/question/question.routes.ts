import { Router } from "express"
import { questionController } from "./question.controller"

const questionRouter = Router()

questionRouter.get("/", (req, res) => questionController.getQuestions(req, res))
questionRouter.post("/", (req, res) => questionController.createQuestion(req, res))
questionRouter.get("/:id", (req, res) => questionController.getQuestionById(req, res))
questionRouter.put("/:id", (req, res) => questionController.updateQuestion(req, res))
questionRouter.delete("/:id", (req, res) => questionController.deleteQuestion(req, res))

export { questionRouter }

