import mysql from 'mysql'
import { config } from 'dotenv'

config()

const db = mysql.createPool({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    database: process.env.NAME_DB,
    password: process.env.PASS_DB 
})

export default db