import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const generateToken = (id, email) => {
  const payload = {
    id,
    email,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

class UserController {
  async createUser(req, res) {
    const { username, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    db.query(
      `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashPassword],
      (err, data) => {
        if (err) {
          res.json(err);
          console.log(err);
        } else {
          data.message = "Вы зарегистрировались!";
          res.json(data);
        }
      }
    );
  }

  async getUsers(req, res) {
    db.query(`SELECT * FROM user`, (err, data) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        res.json(data);
      }
    });
  }

  async logUser(req, res) {
    const { email, password } = req.body;
    db.query(`SELECT * FROM user WHERE email = ?`, [email], (err, data) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        const passwordRes = bcrypt.compareSync(password, data[0].password);
        if (passwordRes) {
          const { id, email } = data[0];
          const token = generateToken(id, email);
          res.json({token, id});
        }
      }
    });
  }

  async getOneUser(req, res) {
    const id = req.params.id;
    db.query(`SELECT * FROM user WHERE id = ?`, [id], (err, data) => {
      if (err) {
        res.json(err);
        console.log(err);
      } else {
        data[0].avatar = Buffer.from(data[0].avatar).toString('base64');
        res.json(data);
      }
    });
  }

  async updateUser(req, res) {}

  async deleteUser(req, res) {}
}

export default new UserController();
