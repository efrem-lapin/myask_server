import db from "../db.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import TokenService from "../service/token-service.js";
import UserService from "../service/user-service.js";

config();

class UserController {
  async registration(req, res) {
    const { username, email, password } = req.body;
    const isExist = await UserService.checkUserByEmail(email);

    if (!isExist) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      const createdUser = await UserService.createUser({
        username,
        email,
        hashPassword,
      });
      const tokens = TokenService.generateTokens({ username, email });

      data.token = tokens.accessToken;
      data.message = "Вы зарегистрировались!";

      res.cookie("token", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json({ id: createdUser.id });
    } else {
      data.message = "Такой пользователь уже зарегистрирован!";
      res.json();
    }
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

  async login(req, res) {
    const { email, password } = req.body;
    db.query(`SELECT * FROM user WHERE email = ?`, [email], (err, data) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        const passwordRes = bcrypt.compareSync(password, data[0].password);
        if (passwordRes) {
          const { id, email, status, avatar, username } = data[0];
          const tokens = TokenService.generateTokens({ id, email });
          res.cookie("token", tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.json({ token: tokens.accessToken, id, username, status, avatar });
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
        res.json(data);
      }
    });
  }

  async updateUser(req, res) {}

  async deleteUser(req, res) {}
}

export default new UserController();
