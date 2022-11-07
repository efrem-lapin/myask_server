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
    const id = req.params.id;
    db.query(
      `SELECT * FROM question WHERE answerer = ?`,
      [id],
      async (err, row1) => {
        if (err) {
          res.json(err);
          console.log(err);
        } else {
           res.json(data)
        }
      }
    );
  }
  async postQuestion(req, res) {
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
}

export default new QuestionController();
