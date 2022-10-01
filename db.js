import mysql from 'mysql'

const db = mysql.createPool({
    host: "frmlpng7.beget.tech",
    user: "frmlpng7_ask",
    database: "frmlpng7_ask",
    password: "MyAsk101"
})

export default db