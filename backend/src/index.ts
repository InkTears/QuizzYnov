import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { questionRouter } from "./feature/question/question.routes";
import { quizRouter } from "./feature/quiz/quiz.routes";
import { leaderboardRouter } from "./feature/leaderboard/leaderboard.routes";
import { authRouter } from "./feature/auth/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import cookieParser from "cookie-parser";
import { seedMockData } from "./seed/mock.seed";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

AppDataSource.initialize()
    .then(async () => {
        console.log("Backend connected");
        await AppDataSource.synchronize();
        await seedMockData();

        app.get("/api/users", async (_req, res) => {
            const users = await AppDataSource.getRepository(User).find();
            res.json(users);
        });

        app.use("/api/auth", authRouter);
        app.use("/api/questions", questionRouter);
        app.use("/api/quiz", authMiddleware, quizRouter);
        app.use("/api/leaderboard", leaderboardRouter);

        app.listen(3000, () => console.log("Server listening on port 3000"));
    })
    .catch((err) => console.error("DB error:", err));
