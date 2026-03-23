import { Request, Response } from "express"
import { quizService } from "./quiz.service"

class QuizController {
    async getTodayQuestions(req: Request, res: Response) {
        try {
            const rawLimit = Number(req.query.limit)
            const limit = Number.isNaN(rawLimit) ? 5 : rawLimit

            const questions = await quizService.getTodayQuestions(limit)
            res.json(questions)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
                return
            }
            res.status(500).json({ message: "Unexpected error" })
        }
    }

    async submitQuiz(req: Request, res: Response) {
        try {
            const { userId, answers, duration } = req.body

            if (typeof userId !== "number" || userId <= 0) {
                res.status(400).json({ message: "Invalid userId" })
                return
            }

            if (!answers || typeof answers !== "object") {
                res.status(400).json({ message: "Invalid answers" })
                return
            }

            const result = await quizService.submitQuiz({ userId, answers, duration })
            res.status(201).json(result)
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("already participated")) {
                    res.status(409).json({ message: error.message })
                    return
                }
                res.status(400).json({ message: error.message })
                return
            }

            res.status(500).json({ message: "Unexpected error" })
        }
    }
}

export const quizController = new QuizController()

