import db from "../db.js";
import bcrypt from "bcrypt"

class UserController {
    async createUser (req, res) {
        const { username, email, password } = req.body
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        db.query(`INSERT INTO user (username, email, password) VALUES (?, ?, ?)`, [username, email, hashPassword], (err, data) => {
            if (err) {
                res.json(err)
                console.log(err)
            } else {
                res.json(data)
            }
        })
    }

    async getUsers (req, res) {
        db.query(`SELECT * FROM user`, (err, data) => {
            if (err) {
                console.log(err)
                res.json(err)
            } else {
                res.json(data)
            }
        })
    }

    async getOneUser (req, res) {
        const id = req.params.id
        db.query(`SELECT * FROM user WHERE id = ?`, [id], (err, data) => {
            if (err) {
                res.json(err)
                console.log(err)
            } else {
                res.json(data)
            }
        })
    }

    async updateUser (req, res) {

    }

    async deleteUser (req, res) {

    }
}

export default new UserController();