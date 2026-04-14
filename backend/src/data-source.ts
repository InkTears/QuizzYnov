import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import * as dotenv from "dotenv"
import path from "path"
import { Question } from "./entity/Question"
import { QuizSession } from "./entity/QuizSession"

dotenv.config({ path: path.resolve(__dirname, "..", ".env") })

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
<<<<<<< HEAD
<<<<<<< HEAD
    entities: [User, Question, QuizSession],
<<<<<<< HEAD
=======
    entities: [User, Question],
>>>>>>> 076696d (projet front presque complet( manque framer-motion))
=======
    entities: [User],
>>>>>>> 9d119a5 (revert changes backend)
=======
    migrations: ["src/migrations/*.ts", "dist/migrations/*.js"],
>>>>>>> 576a9a9 (Refactor authentication API and registration flow to improve error handling and update payload structure)
})
/* test de voir si ça change*/