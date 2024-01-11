const sqlite3 = require("sqlite3").verbose();
const res = require("express/lib/response"); 
const db = new sqlite3.Database("test.sqlite");

// Создание таблицы, если она не существует
const sql =
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, age INT NOT NULL)";
db.run(sql);

class User {
  constructor() {}

  // Создание нового пользователя
  static async create(dataForm, cb) {
    try {
  // const salt = await bcrypt.genSalt(10);
      // const hash = await bcrypt.hash(dataForm.password, salt);

      if (dataForm.password.length < 7) {
        throw new Error('Пароль должен содержать не менее 7 символов');
      }
  
      const registerPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{7,}$/;
      if (!registerPassword.test(dataForm.password)) {
        throw new Error('Пароль должен содержать одну букву, одну цифру, одну заглавную букву и один специальный символ');
      }
  
      const registerEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/g;
      if (!registerEmail.test(dataForm.email)) {
        throw new Error('Введите почту корректно)');
      }

      const sql = 'INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)';
      db.run(sql, [dataForm.name, dataForm.email, dataForm.password, dataForm.age], cb);
    } catch (error) {
      return cb(error);
    }
  }

  // Поиск пользователя по email
  static findByEmail(email, cb) {
    db.get("SELECT * FROM users WHERE email = ?", email, cb);
  }

  // Аутентификация пользователя
  static authentificate(dataForm, cb) {
    User.findByEmail(dataForm.email, (error, user) => {
      if (error) return cb(error);
      if (!user) return cb(); // Пользователь не найден
      if (dataForm.password !== user.password) {
        return cb(); // Неверный пароль
      }
  
      cb(null, user); // Аутентификация успешна
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