import { quizRepository, SubmitQuizPayload } from "./quiz.repository"
import { questionRepository } from "../question/question.repository"
import { AppDataSource } from "../../data-source"
import { Question } from "../../entity/Question"

type SubmitQuizRequest = {
    userId: number
    answers: Record<number, "A" | "B" | "C" | "D">
    duration: number
}

type SubmitQuizResponse = {
    score: number
    totalQuestions: number
    correctAnswers: number
    duration: number
}

class QuizService {
    async getTodayQuestions(userId: number, limit: number) {
        const hasParticipated = await this.hasUserParticipatedToday(userId)
        if (hasParticipated) {
            throw new Error("User has already participated today")
        }

        const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 10) : 10
        const questions = await questionRepository.findRandom(safeLimit)

        return questions.map((question) => ({
            id: question.id,
            content: question.content,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctAnswer: question.correctAnswer,
        }))
    }

    async submitQuiz(payload: SubmitQuizRequest): Promise<SubmitQuizResponse> {
        const existingSession = await quizRepository.getUserTodaySession(payload.userId)
        if (existingSession) {
            throw new Error("User has already participated today")
        }

        const allQuestions = await AppDataSource.getRepository(Question).find()
        const answeredQuestions = Object.keys(payload.answers).map((id) => Number(id))

        let correctCount = 0
        for (const questionId of answeredQuestions) {
            const question = allQuestions.find((q) => q.id === questionId)
            if (!question) {
                throw new Error(`Question ${questionId} not found`)
            }

            const userAnswer = payload.answers[questionId]
            if (userAnswer === question.correctAnswer) {
                correctCount++
            }
        }

        const score = correctCount

        const duration = Math.max(0, Math.min(payload.duration || 0, 3600))
        await quizRepository.createSession(payload.userId, score, duration)

        return {
            score,
            totalQuestions: answeredQuestions.length,
            correctAnswers: correctCount,
            duration,
        }
    }

    async hasUserParticipatedToday(userId: number) {
        const existingSession = await quizRepository.getUserTodaySession(userId)
        return Boolean(existingSession)
    }

    async getUserSessions(userId: number) {
        return quizRepository.getUserSessions(userId)
    }
}

export const quizService = new QuizService()
