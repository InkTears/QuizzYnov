import { Router } from "express"
import { questionController } from "./question.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { adminMiddleware } from "../../middlewares/admin.middleware"

const questionRouter = Router()

questionRouter.get("/", (req, res) => questionController.getQuestions(req, res))
questionRouter.post("/", authMiddleware, adminMiddleware, (req, res) => questionController.createQuestion(req, res))
questionRouter.post("/import-batch", authMiddleware, adminMiddleware, (req, res) =>
	questionController.importQuestionsBatch(req, res)
)
questionRouter.get("/:id", (req, res) => questionController.getQuestionById(req, res))
questionRouter.put("/:id", authMiddleware, adminMiddleware, (req, res) => questionController.updateQuestion(req, res))
questionRouter.delete("/:id", authMiddleware, adminMiddleware, (req, res) => questionController.deleteQuestion(req, res))

export { questionRouter }

