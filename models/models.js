import sequeilize from "../db.js";
import { DataTypes } from "sequelize";

const User = sequeilize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  surname: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
});

const Question = sequeilize.define("question", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  questioner: { type: DataTypes.INTEGER },
  question: { type: DataTypes.TEXT },
  answer: { type: DataTypes.TEXT },
  success: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Token = sequeilize.define("token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.STRING, unique: true },
});

const Like = sequeilize.define("like", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  likerId: { type: DataTypes.INTEGER },
  answererId: { type: DataTypes.INTEGER },
});

const Subscription = sequeilize.define("subscription", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  subscriber: { type: DataTypes.INTEGER },
});

User.hasMany(Question);
Question.belongsTo(User, {
  foreignKey: { name: "answerer" },
  as: "answererData",
});

Question.belongsTo(User, {
  foreignKey: { name: "questioner" },
  as: "questionerData",
});

User.hasOne(Token);
Token.belongsTo(User);

Question.hasMany(Like);
Like.belongsTo(Question);

User.hasMany(Subscription);
Subscription.belongsTo(User);

export { User, Question, Token, Like, Subscription };
