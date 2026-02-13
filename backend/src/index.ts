import "reflect-metadata"
import express from "express"
import cors from "cors"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

const app = express()
app.use(cors())
app.use(express.json())

AppDataSource.initialize().then(async () => {
    console.log("🔥 Connecté à Filess")

    // Route pour récupérer les users
    app.get("/api/users", async (req, res) => {
        const users = await AppDataSource.getRepository(User).find()
        res.json(users)
    })

    app.listen(3000, () => console.log("🚀 Serveur sur le port 3000"))
}).catch(err => console.error("❌ Erreur DB :", err))

/*test*/