import { Request, Response } from "express"
import { questionService } from "./question.service"

class QuestionController {
    async getQuestions(req: Request, res: Response) {
        const questions = await questionService.getAllQuestions()
        res.json(questions)
    }

    async getQuestionById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            if (!Number.isFinite(id) || id <= 0) {
                res.status(400).json({ message: "Invalid question ID" })
                return
            }

            const question = await questionService.getQuestionById(id)
            res.json(question)
        } catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ message: error.message })
                return
            }
            res.status(500).json({ message: "Unexpected error" })
        }
    }

    async getTodayQuestions(req: Request, res: Response) {
        const rawLimit = Number(req.query.limit)
        const limit = Number.isNaN(rawLimit) ? 5 : rawLimit

        const questions = await questionService.getTodayQuestions(limit)
        res.json(questions)
    }

    async createQuestion(req: Request, res: Response) {
        try {
            const question = await questionService.createQuestion(req.body)
            res.status(201).json(question)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
                return
            }

            res.status(500).json({ message: "Unexpected error" })
        }
    }

    async importQuestionsBatch(req: Request, res: Response) {
        try {
            const { questions } = req.body

            if (!Array.isArray(questions)) {
                res.status(400).json({ message: "Field 'questions' must be an array" })
                return
            }

            const mapped = questions.map((item: any) => ({
                content: item.content,
                optionA: item.option_a,
                optionB: item.option_b,
                optionC: item.option_c,
                optionD: item.option_d,
                correctAnswer: item.correct_answers,
            }))

            const result = await questionService.importQuestionsBatch(mapped)
            res.status(201).json(result)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
                return
            }

            res.status(500).json({ message: "Unexpected error" })
        }
    }

    async updateQuestion(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            if (!Number.isFinite(id) || id <= 0) {
                res.status(400).json({ message: "Invalid question ID" })
                return
            }

            const question = await questionService.updateQuestion(id, req.body)
            res.json(question)
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("not found")) {
                    res.status(404).json({ message: error.message })
                    return
                }
                res.status(400).json({ message: error.message })
                return
            }

            res.status(500).json({ message: "Unexpected error" })
        }
    }

    async deleteQuestion(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            if (!Number.isFinite(id) || id <= 0) {
                res.status(400).json({ message: "Invalid question ID" })
                return
            }

            await questionService.deleteQuestion(id)
            res.status(204).send()
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("not found")) {
                    res.status(404).json({ message: error.message })
                    return
                }
                res.status(400).json({ message: error.message })
                return
            }

            res.status(500).json({ message: "Unexpected error" })
        }
    }
}

export const questionController = new QuestionController()

