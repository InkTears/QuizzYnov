import { Router } from "express"
import { leaderboardController } from "./leaderboard.controller"

const leaderboardRouter = Router()

leaderboardRouter.get("/", (req, res) => leaderboardController.getLeaderboard(req, res))

export { leaderboardRouter }

