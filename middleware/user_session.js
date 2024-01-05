const User = require("../models/user");

module.exports = function (req, res, next) {
  if (!req.session.userEmail) return next();
  User.findByEmail(req.session.userEmail, (error, userData) => {
    if (error) return next(error);
    if (userData) req.user = res.locals.user = userData;
    next();
  });
};
