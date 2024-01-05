const User = require("../models/user");
const link = "https://kappa.lol/VMimi";
exports.form = (req, res) => {
  res.render("registerForm", { title: "Register",link: link  });
};


exports.submit = (req, res, next) => {
  User.findByEmail(req.body.email, (error, user) => {
    if (error) return next(error);
    if (user) {
      console.log("Такой пользователь в базе уже существует");
      res.redirect("/");
    } else {
      User.create(req.body, (err) => {
        if (err) return next(err);
        req.session.userEmail = req.body.email;
        req.session.userName = req.body.name;
        res.redirect("/");
      });
    }
  });
};
