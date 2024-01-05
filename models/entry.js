const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.db");

const sql =
  "CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT NOT NULL, title TEXT, content TEXT NOT NULL)";
db.run(sql);

class Entry {
  constructor() {}
  static create(data) {
    const sql =
      "INSERT INTO entries (username, title, content) VALUES (?, ?, ?)";
    db.run(sql, data.username, data.title, data.content);
  }
  static selectAll(cb) {
    db.all("SELECT * FROM entries", cb);
  }

  static getEntryById(entryId, cb) {
    const sql = "SELECT * FROM entries WHERE id = ?";
    db.get(sql, entryId, cb);
  }

  static delete(entryId, cb) {
    const sql = "DELETE FROM entries WHERE id = ?";
    db.run(sql, entryId, function (err) {
      if (err) {
        return cb(err);
      }
      cb(null);
    });
  }

  static update(entryId, newData, cb) {
    const checkExistenceSql = "SELECT * FROM entries WHERE id = ?";
    db.get(checkExistenceSql, entryId, (err, row) => {
      if (err) {
        return cb(err);
      }

      if (!row) {
        return cb(new Error("Entry not found"));
      }

      const updateSql =
        "UPDATE entries SET title = ?, content = ? WHERE id = ?";
      db.run(updateSql, newData.title, newData.content, entryId, cb);
    });
  }
}

module.exports = Entry;
