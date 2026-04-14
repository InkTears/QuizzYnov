import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import * as dotenv from "dotenv"
import path from "path"
import { Question } from "./entity/Question"
import { QuizSession } from "./entity/QuizSession"

dotenv.config({ path: path.resolve(__dirname, "..", ".env") })

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Question, QuizSession],
    migrations: ["src/migrations/*.ts", "dist/migrations/*.js"],
})
