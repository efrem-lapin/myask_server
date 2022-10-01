import express from "express"
import mysql from "mysql"
import userRouter from "./routes/user.routes.js"
import db from "./db.js"

const PORT = process.env.PORT || 5000

const app = express()

db.getConnection(err => {
    if (err) {
        console.log(err)
        return err
    } else {
        console.log('Database OK')
    }
})

app.use(express.json())

app.use('/api', userRouter)

app.listen(PORT, () => console.log(`Server started on ${PORT} port`))