const User = require("../models/user");
const link = "https://kappa.lol/VMimi";
exports.form = (req, res) => {
  res.render("loginForm", { title: "Login",link: link  });
};


exports.submit = (req, res) => {
  User.authentificate(req.body.loginForm, (error, data) => {
   
    if (!data) {
      console.log("Имя или пароль неверный");
      res.redirect("back");
    } else {
      req.session.userEmail = data.email;
      req.session.userName = data.name;
      res.redirect("/");
    }
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
