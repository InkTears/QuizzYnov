import { AppDataSource } from "../../data-source"
import { QuizSession } from "../../entity/QuizSession"

export type SubmitQuizPayload = {
    userId: number
    answers: Record<number, "A" | "B" | "C" | "D">
    duration: number
}

function toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10)
}

class QuizRepository {
    private readonly repository = AppDataSource.getRepository(QuizSession)

    async getUserTodaySession(userId: number) {
        const today = toIsoDate(new Date())
        return this.repository.findOne({
            where: { userId, date: today },
        })
    }

    async createSession(userId: number, score: number, duration: number) {
        const today = toIsoDate(new Date())
        const session = this.repository.create({
            userId,
            date: today,
            score,
            duration,
        })
        return this.repository.save(session)
    }
}

export const quizRepository = new QuizRepository()

