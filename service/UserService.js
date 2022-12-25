import bcrypt from "bcrypt";
import tokenService from "./TokenService.js";
import ApiError from "../exceptions/ApiError.js";
import { User } from "../models/models.js";

class UserService {
  async registration(email, password, name, surname) {
    const isExist = await User.findOne({ where: { email } });

    if (isExist) {
      throw ApiError.badRequest("Этот email уже используется");
    }

    const formatName = this.formatName(name);
    const formatSurname = this.formatName(surname);

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const tokens = tokenService.generateTokens({ name, email });

    const createdUser = await User.create({
      email,
      password: hashPassword,
      name: formatName,
      surname: formatSurname,
    });

    await tokenService.saveRefreshToken(createdUser.id, tokens.refreshToken);

    return { user: createdUser, token: tokens.accessToken };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const passwordMatch = bcrypt.compareSync(password, user.password);

      if (passwordMatch) {
        const tokens = tokenService.generateTokens({
          id: user.id,
          email: user.email,
        });

        return { user: user, tokens };
      }

      throw ApiError.badRequest("Неверный логин или пароль");
    }

    throw ApiError.badRequest("Неверный логин или пароль");
  }

  async getUserById(id) {
    const user = await User.findOne({ where: { id } });
    if (user) return user;
    throw ApiError.badRequest("Пользователя с таким id не существует");
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ where: { email } });
    if (user) return user;
    throw ApiError.badRequest("Пользователя с таким email не существует");
  }

  formatName(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
}

export default new UserService();
