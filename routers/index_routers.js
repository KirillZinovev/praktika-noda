const express = require("express");
const path = require("path");
const router = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const entries = require("../controllers/entries");
const validate = require("../middleware/validate");
const Entry = require('../models/entry');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


router.get("/", entries.list);


router.get("/post", entries.form);


router.post(
  "/post",
  upload.single("entryImage"), 
  validate.required("[entry[title]]"),
  validate.required("[entry[content]]"),
  validate.lengthAbove("[entry[title]]", 4),
  entries.submit
);

router.get("/register", register.form);


router.post("/register", register.submit);


router.get("/login", login.form);


router.post("/login", login.submit);


router.get("/delete/:id", entries.delete);


router.get("/edit/:id", entries.updateForm);


router.post("/edit/:id", entries.updateSubmit);
router.put('/edit/:id', async (req, res, next) => {
  try {
    // Получение данных из запроса
    const { title, content, imagePath } = req.body;

    // Поиск записи в блоге по идентификатору
    const entry = await Entry.findById(req.params.id);

    // Если запись не найдена, возвращаем ошибку 404
    if (!entry) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    // Обновление данных записи
    entry.title = title;
    entry.content = content;
    entry.imagePath = imagePath;
    entry.timestamp = new Date();

    // Сохранение изменений в базе данных
    await entry.save();

    // Возвращаем обновленную запись в блоге
    res.json(entry);
  } catch (error) {
    // Обработка ошибок
    next(error);
  }
});
router.get("/logout", login.logout);
module.exports = router;

