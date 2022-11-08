import db from "../db.js";

class QuestionController {
  async getSuccessQuestion(req, res) {
    const { id } = req.body;

    db.query(
      `SELECT * from question WHERE answerer = ? AND success = true`,
      [id],
      (err, data) => {
        if (err) {
          res.json(err);
          console.log(err);
        } else {
          res.json(data);
        }
      }
    );
  }

  async getUnansweredQuestion(req, res) {
    const idAnswerer = req.params.id;
    db.query(
      `SELECT * FROM question WHERE answerer = ? AND success = false ORDER BY id DESC`,
      [idAnswerer],
      async (err, data) => {
        if (err) {
          res.json(err);
          console.log(err);
        } else {
          res.json(data);
        }
      }
    );
  }

  async getAnswers(req, res) {
    const idAnswerer  = req.params.id;

    db.query(
      `SELECT * FROM question WHERE answerer = ? AND success = true ORDER BY id DESC`,
      [idAnswerer],
      (err, data) => {
        if (err) {
          res.json(err);
          console.log(err);
        } else {
          res.json(data);
        }
      }
    );
  }

  async setQuestion(req, res) {
    const { questioner, question, answerer } = req.body;

    db.query(
      `INSERT INTO question (questioner, question, answer, success, answerer) VALUES(?, ?, ?, ?, ?)`,
      [questioner, question, "", false, answerer],
      (err, data) => {
        if (err) {
          res.json(err);
          console.log(err);
        } else {
          data.message = "Вопрос отправлен!";
          res.json(data);
        }
      }
    );
  }

  async setAnswer(req, res) {
    const { id, answer } = req.body;

    db.query(
      `UPDATE question SET answer = ?, success = TRUE WHERE id = ?`,
      [answer, id],
      (err, data) => {
        if (err) {
          res.json(err);
          console.log(err);
        } else {
          data.message = "Вы ответили на впорос!";
          res.json(data);
        }
      }
    );
  }
}

export default new QuestionController();
