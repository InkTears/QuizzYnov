import { leaderboardRepository } from "./leaderboard.repository"

function toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10)
}

function startOfUtcDay(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function addUtcDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setUTCDate(result.getUTCDate() + days)
    return result
}

class LeaderboardService {
    async getPreviousWeekLeaderboard(rawLimit?: number) {
        const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit!, 1), 50) : 10
        const { weekStart, weekEnd } = this.getPreviousWeekDateRange()

        const rows = await leaderboardRepository.getWeeklyLeaderboard(weekStart, weekEnd, limit)

        return {
            weekStart,
            weekEnd,
            leaderboard: rows.map((row, index) => ({
                rank: index + 1,
                userId: row.userId,
                userName: row.userName,
                totalScore: row.totalScore,
                gamesCount: row.gamesCount,
            })),
        }
    }

    private getPreviousWeekDateRange(): { weekStart: string; weekEnd: string } {
        const todayUtc = startOfUtcDay(new Date())
        const day = todayUtc.getUTCDay()
        // JS renvoie dimanche = 0, lundi = 1, ... samedi = 6.
        // La formule (day + 6) % 7 convertit ce format en "jours depuis lundi":
        // lundi(1)->0, mardi(2)->1, ... dimanche(0)->6.
        const daysSinceMonday = (day + 6) % 7
        const currentWeekMonday = addUtcDays(todayUtc, -daysSinceMonday)
        const previousWeekMonday = addUtcDays(currentWeekMonday, -7)
        const previousWeekSunday = addUtcDays(previousWeekMonday, 6)

        return {
            weekStart: toIsoDate(previousWeekMonday),
            weekEnd: toIsoDate(previousWeekSunday),
        }
    }
}

export const leaderboardService = new LeaderboardService()
