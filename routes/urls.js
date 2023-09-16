const express = require("express");
const app = express();
const urlsRouter = express.Router();

app.set("view engine", "ejs");

urlsRouter.get("/new", (req, res) => {
    res.render("newUrl");
});

module.exports = urlsRouter;
