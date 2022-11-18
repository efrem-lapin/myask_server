import db from "../db.js";

class UserService {
  async checkUserByEmail(email) {
    db.query(`SELECT id FROM user WHERE email = ?`, [email], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (!!data.id) return true;
        else false;
      }
    });
  }

  async createUser(user) {
    db.query(
      `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`,
      [user.username, user.email, user.hashPassword],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return data;
        }
      }
    );
  }
}

export default new UserService();
