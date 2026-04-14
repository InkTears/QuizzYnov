import { AnswerOption } from "../../entity/Question"
import { CreateQuestionPayload, questionRepository } from "./question.repository"

type PublicQuestion = {
    id: number
    content: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
}

class QuestionService {
    private toPublicQuestion(question: {
        id: number
        content: string
        optionA: string
        optionB: string
        optionC: string
        optionD: string
    }): PublicQuestion {
        return {
            id: question.id,
            content: question.content,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
        }
    }

    async getAllQuestions() {
        const questions = await questionRepository.findAll()
        return questions.map((question) => this.toPublicQuestion(question))
    }

    async getQuestionById(id: number) {
        const question = await questionRepository.findById(id)
        if (!question) {
            throw new Error("Question not found")
        }
        return this.toPublicQuestion(question)
    }

    async getTodayQuestions(limit: number) {
        const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 5
        const questions = await questionRepository.findRandom(safeLimit)
        return questions.map((question) => this.toPublicQuestion(question))
    }

    async createQuestion(payload: Partial<CreateQuestionPayload>) {
        const normalized = this.validateAndNormalizePayload(payload, true) as CreateQuestionPayload
        const created = await questionRepository.createQuestion(normalized)
        return this.toPublicQuestion(created)
    }

    async updateQuestion(id: number, payload: Partial<CreateQuestionPayload>) {
        const question = await questionRepository.findById(id)
        if (!question) {
            throw new Error("Question not found")
        }

        const normalized = this.validateAndNormalizePayload(payload, false)
        const updated = await questionRepository.updateQuestion(id, normalized)
        if (!updated) {
            throw new Error("Failed to update question")
        }
        return this.toPublicQuestion(updated)
    }

    async deleteQuestion(id: number) {
        const question = await questionRepository.findById(id)
        if (!question) {
            throw new Error("Question not found")
        }

        const deleted = await questionRepository.deleteQuestion(id)
        if (!deleted) {
            throw new Error("Failed to delete question")
        }
    }

    async importQuestionsBatch(payloads: Array<Partial<CreateQuestionPayload>>) {
        if (!Array.isArray(payloads) || payloads.length === 0) {
            throw new Error("Question batch is required")
        }

        if (payloads.length > 100) {
            throw new Error("Batch size cannot exceed 100")
        }

        const normalized = payloads.map((item) =>
            this.validateAndNormalizePayload(item, true) as CreateQuestionPayload
        )

        await questionRepository.createManyQuestions(normalized)
        return { insertedCount: normalized.length }
    }

    private validateAndNormalizePayload(
        payload: Partial<CreateQuestionPayload>,
        requireAll: boolean = true
    ): Partial<CreateQuestionPayload> {
        const requiredFields: Array<keyof CreateQuestionPayload> = [
            "content",
            "optionA",
            "optionB",
            "optionC",
            "optionD",
            "correctAnswer",
        ]

        if (requireAll) {
            for (const field of requiredFields) {
                const value = payload[field]
                if (typeof value !== "string" || value.trim() === "") {
                    throw new Error(`Field '${field}' is required`)
                }
            }
        }

        const result: Partial<CreateQuestionPayload> = {}

        if (payload.content !== undefined) {
            const content = payload.content.trim()
            if (content === "") throw new Error("Field 'content' cannot be empty")
            result.content = content
        }

        for (const optionKey of ["optionA", "optionB", "optionC", "optionD"] as const) {
            if (payload[optionKey] !== undefined) {
                const option = payload[optionKey]!.trim()
                if (option === "") throw new Error(`Field '${optionKey}' cannot be empty`)
                result[optionKey] = option
            }
        }

        if (payload.correctAnswer !== undefined) {
            const answer = payload.correctAnswer.trim().toUpperCase() as AnswerOption
            if (!["A", "B", "C", "D"].includes(answer)) {
                throw new Error("Field 'correctAnswer' must be one of: A, B, C or D")
            }
            result.correctAnswer = answer
        }

        return result
    }
}

export const questionService = new QuestionService()

