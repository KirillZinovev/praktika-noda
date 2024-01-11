const Entry = require("../models/entry");

// Отображение списка записей
exports.list = (req, res, next) => {
  Entry.selectAll((err, entries) => {
    if (err) return next(err);

    const userData = req.user; // Получение данных пользователя из запроса
    res.render("entries", { title: "List", entries: entries, user: userData });
  });
};

// Отображение формы для создания записи
exports.form = (req, res) => {
  res.render("post", { title: "Post" });
};

// Обработка отправки новой записи
exports.submit = (req, res, next) => {
  try {
    const username = req.user ? req.user.name : null; // Получение имени пользователя из запроса
    const data = req.body.entry; // Получение данных новой записи из тела запроса

    const entry = {
      username: username,
      title: data.title,
      content: data.content,
    };

    Entry.create(entry); // Создание новой записи
    res.redirect("/"); // Перенаправление на главную страницу
  } catch (err) {
    return next(err);
  }
};

// Удаление записи
exports.delete = (req, res, next) => {
  const entryId = req.params.id; // Получение идентификатора записи из параметров запроса

  Entry.delete(entryId, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Перенаправление на главную страницу
  });
};

// Отображение формы для обновления записи
exports.updateForm = (req, res) => {
  const entryId = req.params.id; // Получение идентификатора записи из параметров запроса
  Entry.getEntryById(entryId, (err, entry) => {
    if (err) {
      return res.redirect("/"); // Перенаправление на главную страницу в случае ошибки
    }
    res.render("update", { title: "Update", entry: entry }); // Отображение формы обновления с данными записи
  });
};

// Обработка отправки обновленных данных записи
exports.updateSubmit = (req, res, next) => {
  const entryId = req.params.id; // Получение идентификатора записи из параметров запроса
  const newData = {
    title: req.body.entry.title, // Получение обновленного заголовка из тела запроса
    content: req.body.entry.content, // Получение обновленного содержимого из тела запроса
  };

  Entry.update(entryId, newData, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Перенаправление на главную страницу после успешного обновления
  });
};

