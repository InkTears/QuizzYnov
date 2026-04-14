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

    async getUserSessions(userId: number) {
        return this.repository
            .createQueryBuilder("session")
            .innerJoin("session.user", "user")
            .where("session.userId = :userId", { userId })
            .select([
                "session.id AS id",
                "session.date AS date",
                "session.score AS score",
                "session.duration AS duration",
                "session.completedAt AS completedAt",
                "user.name AS userName",
            ])
            .orderBy("session.completedAt", "DESC")
            .getRawMany<{
                id: number
                date: string
                score: number
                duration: number | null
                completedAt: Date
                userName: string
            }>()
    }
}

export const quizRepository = new QuizRepository()

