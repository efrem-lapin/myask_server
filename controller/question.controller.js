import { Like, Question, User } from "../models/models.js";
import jwt from "jsonwebtoken";

class QuestionController {
  async getSuccessQuestion(req, res, next) {
    try {
      const { id } = req.body;
      const questions = Question.findAll({
        where: { answerer: id, success: true },
        order: [["id", "DESC"]],
      });

      res.json(questions);
    } catch (error) {
      next(error);
    }
  }

  async getUnansweredQuestion(req, res, next) {
    try {
      const id = Number(req.params.id);
      const questions = await Question.findAll({
        where: { answerer: id, success: false },
        attributes: ["id", "question"],
        order: [["id", "DESC"]],
        include: [
          {
            model: User,
            as: "questionerData",
            attributes: ["id", "name", "surname", "avatar"],
          },
        ],
      });
      res.json(questions);
    } catch (error) {
      next(error);
    }
  }

  async getAnswers(req, res) {
    const id = req.params.id;
    const questions = await Question.findAll({
      where: { answerer: id, success: true },
      include: [
        {
          model: Like,
          as: "likes",
          attributes: ["likerId"],
        },
        {
          model: User,
          as: "answererData",
          attributes: ["id", "name", "surname", "avatar"],
        },

        {
          model: User,
          as: "questionerData",
          attributes: ["id", "name", "surname", "avatar"],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.json(questions);
  }

  async setQuestion(req, res, next) {
    try {
      const token = req.headers.authorization.slice(7);
      const validToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (validToken) {
        const { questioner, question, answerer } = req.body;
        const resQuestion = await Question.create({
          questioner,
          question,
          answerer,
        });

        res.json({ message: "Ваш вопрос отправлен" });
      }
    } catch (error) {
      next(error);
    }
  }

  async setAnswer(req, res, next) {
    try {
      const { id, answer } = req.body;
      const question = await Question.findOne({ where: { id } });
      question.answer = answer;
      question.success = true;
      question.save();
      res.json({ message: "Вы ответили на вопрос" });
    } catch (error) {
      next(error);
    }
  }

  async removeQuestion(req, res, next) {
    try {
      const questionId = req.body.id;
      await Like.destroy({ where: { questionId } });
      await Question.destroy({ where: { id: questionId } });
      res.json({ message: "Вопрос удален" });
    } catch (error) {
      next(error);
    }
  }

  async getLastAnswers(req, res, next) {
    try {
      const answers = await Question.findAll({
        where: { success: true },
        include: [
          {
            model: Like,
            as: "likes",
            attributes: ["likerId"],
          },
          {
            model: User,
            as: "answererData",
            attributes: ["id", "name", "surname", "avatar"],
          },

          {
            model: User,
            as: "questionerData",
            attributes: ["id", "name", "surname", "avatar"],
          },
        ],
        order: [["id", "DESC"]],
        limit: 10,
        offset: 0,
      });
      res.json(answers);
    } catch (error) {
      next(error);
    }
  }
}

export default new QuestionController();
