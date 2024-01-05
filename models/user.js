const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const db = new sqlite3.Database("test.sqlite");

const sql =
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, age INT NOT NULL)";

db.run(sql);

class User {
  constructor() {}
  static async create(dataForm, cb) {
    try {
      // const salt = await bcrypt.genSalt(10);
      // const hash = await bcrypt.hash(dataForm.password, salt);

      const sql1 =
        "INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)";
      db.run(sql1, dataForm.name, dataForm.email, dataForm.password, dataForm.age, cb);
    } catch (error) {
      if (error) return next(error);
    }
  }

  static findByEmail(email, cb) {
    db.get("SELECT * FROM users WHERE email = ?", email, cb);
  }
  static authentificate(dataForm, cb) {
    User.findByEmail(dataForm.email, (error, user) => {
      if (error) return cb(error);
      if (!user) return cb();
      if (dataForm.password === user.password) {
        return cb(null, user);
      } else {
        return cb();
      }
    });
  }
  // static authentificate(dataForm, cb) {
  //   User.findByEmail(dataForm.email, (error, user) => {
  //     if (error) return cb(error);
  //     if (!user) return cb();
  //     const result = bcrypt.compare(
  //       dataForm.password,
  //       user.password,
  //       (error, result) => {
  //         if (result) return cb(null, user); //ToDo: check
  //         cb();
  //       }
  //     );
  //   });
  // }
}

module.exports = User;
