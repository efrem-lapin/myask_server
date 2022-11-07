import express from "express"
import * as dotenv from "dotenv"
import mysql from "mysql"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import questionRouter from "./routes/question.routes.js"
import db from "./db.js"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()

db.getConnection(err => {
    if (err) {
        console.log(err)
        return err
    } else {
        console.log('Database OK')
    }
})

app.use(cors())
app.use(express.json())

app.use('/api', userRouter)
app.use('/api', questionRouter)

app.listen(PORT, () => console.log(`Server started on ${PORT} port`))