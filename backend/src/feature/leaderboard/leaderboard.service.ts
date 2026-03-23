import { leaderboardRepository } from "./leaderboard.repository"

function toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10)
}

class LeaderboardService {
    async getDailyLeaderboard(rawDate?: string, rawLimit?: number) {
        const date = this.validateDateOrFallback(rawDate)
        const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit!, 1), 50) : 10

        const rows = await leaderboardRepository.getDailyLeaderboard(date, limit)

        return {
            date,
            leaderboard: rows.map((row, index) => ({
                rank: index + 1,
                userId: row.userId,
                userName: row.userName,
                totalScore: row.totalScore,
                gamesCount: row.gamesCount,
            })),
        }
    }

    private validateDateOrFallback(rawDate?: string): string {
        if (!rawDate) {
            return toIsoDate(new Date())
        }

        const datePattern = /^\d{4}-\d{2}-\d{2}$/
        if (!datePattern.test(rawDate)) {
            throw new Error("Query param 'date' must use YYYY-MM-DD format")
        }

        return rawDate
    }
}

export const leaderboardService = new LeaderboardService()

