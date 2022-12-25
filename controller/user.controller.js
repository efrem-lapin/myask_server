import UserService from "../service/UserService.js";
import tokenService from "../service/TokenService.js";
import UserDto from "../dtos/UserDto.js";
import ApiError from "../exceptions/ApiError.js";
import { Like, Question, Subscription, User } from "../models/models.js";
import jwt from "jsonwebtoken";

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, name, surname } = req.body;

      const data = await UserService.registration(
        email,
        password,
        name,
        surname
      );

      if (data) {
        res.cookie("token", data.token, {
          maxAge: process.env.JWT_TIME_REFRESH,
          httpOnly: true,
        });

        res.json({ message: "Вы зарегистрировались", user: data.user });
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);

      if (!userData) {
        throw "Неверный email или пароль";
      }

      if (userData) {
        res.cookie("token", userData.tokens.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        const userDto = new UserDto(userData.user);
        res.json({ user: userDto, token: userData.tokens.accessToken });
      }
    } catch (error) {
      next(error);
    }
  }

  async getOneUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await User.findOne({
        where: { id },
        include: [
          {
            model: Subscription,
            attributes: ["subscriber"],
          },
        ],
      });
      const amountLikes = (
        await Like.findAndCountAll({ where: { answererId: id } })
      ).count;
      const userDto = new UserDto(user);
      res.json({ ...userDto, likes: amountLikes });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res) {}

  async deleteUser(req, res) {}

  async refreshToken(req, res, next) {
    try {
      const { token } = req.cookies;

      if (token) {
        const userData = tokenService.validateRefreshToken(token);

        if (!userData) {
          throw ApiError.badRequest("Token error");
        }

        const { email, name } = userData;

        const user = await User.findOne({
          where: { email },
          include: [{ model: Subscription, attributes: ["subscriber"] }],
        });
        const amountLikes = (
          await Like.findAndCountAll({ where: { answererId: user.id } })
        ).count;
        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({ email, name });
        const data = {
          user: { ...userDto, likes: amountLikes },
          token: tokens.accessToken,
        };
        res.json(data);
      }
    } catch (error) {
      next(error);
    }
  }
  async updateUser(req, res, next) {
    try {
      const token = req.headers.authorization.slice(7);
      const validToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      if (!validToken) {
        throw "Token error";
      }

      const email = validToken.email;
      const user = await User.findOne({ where: { email } });

      const avatar = req.files && req.files.avatar;
      if (avatar) {
        const avatarName = encodeURI(Date.now() + "-" + avatar.name);
        const path = `${process.cwd()}\\uploads\\avatars\\${avatarName}`;
        const pathDB = `${process.env.HOST}/api/img/${avatarName}`;

        avatar.mv(path, (err) => {
          if (err) console.log(err);
          return res.status(500).send(err);
        });

        const link = user.avatar;

        // delete prev avatar
        // await fs.unlink(link, err => {
        //   if(err) console.log(err);
        // })

        user.avatar = pathDB;
        user.save();
      }

      // formating strings name and surname
      const { name, surname } = req.body,
        formatName = UserService.formatName(name),
        formatSurname = UserService.formatName(surname);

      // checking for changes
      if (formatName !== user.name) {
        user.name = formatName;
        user.save();
      }

      // checking for changes
      if (formatSurname !== user.surname) {
        user.surname = formatSurname;
        user.save();
      }

      res.json({ message: "user updated" });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { token } = req.cookies;
      const dataJwt = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      if (!dataJwt) {
        throw "Token error";
      }

      const user = await User.findOne({ where: { id: dataJwt.id } });
      user.token = "";
      user.save();

      res
        .clearCookie("token", { secure: true, httpOnly: true })
        .json({ message: "OK" });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const token = req.headers.authorization.slice(7);
      const validToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      if (!validToken) {
        throw "Token error";
      }

      const { status, id } = req.body;

      const user = await User.findOne({ where: { id } });
      user.status = status;
      user.save();

      res.json({message: "Статус изменён"})
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
