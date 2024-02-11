const express = require("express");
const favicon = require("express-favicon");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const adminRoutes = require("./controllers/admin");
const session = require("express-session");
const message = require("./middleware/message");
const messanger = "https://kappa.lol/iSONv";
const link = "https://kappa.lol/VMimi";
const bodyParser = require("body-parser");
// const morgan = require("morgan");
const winston = require("winston");
const app = express();
app.use(bodyParser.json());

// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));
const myRoutes = require("./routers/index_routers");
const userSession = require("./middleware/user_session");
require("dotenv").config;
const port = process.env.PORT || "3000";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const flash = require('connect-flash');
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "views")));
app.use("/uploads", express.static("uploads"));
// app.use(morgan("tiny"));
app.use(
  session({
    secret: "process.env.SECRET",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  "/css/bootstrap.css",
  express.static(
    path.join(
      __dirname,
      "public/css/bootstrap-5.3.2/dist/css/bootstrap.min.css"
    )
  )
);

app.use(favicon(__dirname + "/public/img/logo.png"));
app.use(userSession);
app.use(message);
app.use(myRoutes);

app.get("/", (req, res) => {
  res.render("registerForm.ejs", { link: link, messanger: messanger });
});

app.use(adminRoutes);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ` + port);
});

if (app.get("env") != "development") {
} else {
}
