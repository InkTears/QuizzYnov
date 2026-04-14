import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import "reflect-metadata"
import express from "express"
import cors from "cors"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { questionRouter } from "./feature/question/question.routes"
import { quizRouter } from "./feature/quiz/quiz.routes"
import { leaderboardRouter } from "./feature/leaderboard/leaderboard.routes"
import { authRouter } from "./feature/auth/auth.routes";
import { seedMockData } from "./seed/mock.seed"
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/auth.middleware"



const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser());


AppDataSource.initialize().then(async () => {
    console.log("🔥 Connecté à Filess")

    // Seed des données mock
    await seedMockData()

    // Route pour récupérer les users
    app.get("/api/users", async (req, res) => {
        const users = await AppDataSource.getRepository(User).find()
        res.json(users)
    })

    // route feature auth 
    app.use("/api/auth", authRouter);


    // Routes features
    app.use("/api/questions", questionRouter)
    app.use("/api/quiz", quizRouter)
    app.use("/api/leaderboard", leaderboardRouter)

    app.listen(3000, () => console.log("🚀 Serveur sur le port 3000"))
}).catch(err => console.error("❌ Erreur DB :", err))
