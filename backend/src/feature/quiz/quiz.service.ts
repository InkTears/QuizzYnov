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
    async getTodayQuestions(limit: number) {
        const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 5
        const questions = await questionRepository.findRandom(safeLimit)

        return questions.map((question) => ({
            id: question.id,
            content: question.content,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
        }))
    }

    async submitQuiz(payload: SubmitQuizRequest): Promise<SubmitQuizResponse> {
        // Validation 1: Vérifier que l'utilisateur n'a pas déjà participé aujourd'hui
        const existingSession = await quizRepository.getUserTodaySession(payload.userId)
        if (existingSession) {
            throw new Error("User has already participated today")
        }

        // Validation 2: Récupérer toutes les questions et vérifier les réponses
        const allQuestions = await AppDataSource.getRepository(Question).find()
        const answeredQuestions = Object.keys(payload.answers).map((id) => Number(id))

        let correctCount = 0
        for (const questionId of answeredQuestions) {
            const question = allQuestions.find((q) => q.id === questionId)
            if (!question) {
                throw new Error(`Question ${questionId} not found`)
            }

            const userAnswer = payload.answers[questionId]
            if (question.correctAnswers.includes(userAnswer)) {
                correctCount++
            }
        }

        // Calcul du score: 1 point par bonne réponse
        const score = correctCount

        // Enregistrer la session
        const duration = Math.max(0, Math.min(payload.duration || 0, 3600))
        await quizRepository.createSession(payload.userId, score, duration)

        return {
            score,
            totalQuestions: answeredQuestions.length,
            correctAnswers: correctCount,
            duration,
        }
    }
}

export const quizService = new QuizService()

