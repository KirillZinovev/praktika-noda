exports.getfield = (req, field) => {
  let value;
  field.forEach((element) => {
    value = req.body[element];
  });
  return value;
};

function parseField(field) {
  return field.split(/\[|\]/).filter((s) => s);
}

exports.required = (field) => {
  field = parseField(field);

  return (req, res, next) => {
    if (getField(req, field)) {
      next();
    } else {
      res.error("Required"); //готовит сообщение пользователя
      res.redirect("back");
    }
  };
};

exports.lenghtAbove = (field, len) => {
  field = parseField(field);

  return (req, res, next) => {
    if (getField(req, field).lenght > len) {
      next();
    } else {
      res.error("Required"); //готовит сообщение пользователя
      res.redirect("back");
    }
  };
};
