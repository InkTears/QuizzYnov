import { Request, Response } from "express"
import { leaderboardService } from "./leaderboard.service"

class LeaderboardController {
    async getLeaderboard(req: Request, res: Response) {
        try {
            const rawLimit = Number(req.query.limit)
            const limit = Number.isNaN(rawLimit) ? undefined : rawLimit
            const date = typeof req.query.date === "string" ? req.query.date : undefined

            const leaderboard = await leaderboardService.getDailyLeaderboard(date, limit)
            res.json(leaderboard)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
                return
            }

            res.status(500).json({ message: "Unexpected error" })
        }
    }
}

export const leaderboardController = new LeaderboardController()

