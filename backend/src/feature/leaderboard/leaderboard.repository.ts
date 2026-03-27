import { AppDataSource } from "../../data-source"
import { QuizSession } from "../../entity/QuizSession"

type LeaderboardRow = {
    userId: number
    userName: string
    totalScore: number
    gamesCount: number
}

class LeaderboardRepository {
    private readonly repository = AppDataSource.getRepository(QuizSession)

    async getDailyLeaderboard(date: string, limit: number): Promise<LeaderboardRow[]> {
        const rows = await this.repository
            .createQueryBuilder("quizSession")
            .innerJoin("quizSession.user", "user")
            .select("quizSession.userId", "userId")
            .addSelect("user.name", "userName")
            .addSelect("SUM(quizSession.score)", "totalScore")
            .addSelect("COUNT(quizSession.id)", "gamesCount")
            .where("quizSession.date = :date", { date })
            .groupBy("quizSession.userId")
            .addGroupBy("user.name")
            .orderBy("totalScore", "DESC")
            .addOrderBy("user.name", "ASC")
            .limit(limit)
            .getRawMany<{
                userId: string
                userName: string
                totalScore: string
                gamesCount: string
            }>()

        return rows.map((row) => ({
            userId: Number(row.userId),
            userName: row.userName,
            totalScore: Number(row.totalScore),
            gamesCount: Number(row.gamesCount),
        }))
    }
}

export const leaderboardRepository = new LeaderboardRepository()

