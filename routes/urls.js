const express = require("express");
const app = express();
const urlsRouter = express.Router();
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
urlsRouter.use(cookieParser());

urlsRouter.get("/new", (req, res) => {
    if (req.cookies.user) {
        res.render("newUrl");
    } else {
        res.redirect("/auth/login");
    }
});

module.exports = urlsRouter;
