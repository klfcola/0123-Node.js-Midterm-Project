const express = require("express");
const app = express();
const urlsRouter = express.Router();
const cookieParser = require("cookie-parser");
const urlsData = require("../models/urls.json");
const userData = require("../models/users.json");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
urlsRouter.use(cookieParser());

urlsRouter.get("/new", (req, res) => {
    if (req.cookies.user) {
        res.render("newUrl");
    } else {
        res.redirect("/auth/login");
    }
});

urlsRouter.get("/:id", (req, res) => {
    const urlId = req.params.id;
    // console.log(urlId);
    const url = urlsData[urlId];
    // console.log(url);

    if (!url) {
        return res.send("<h1>This URL doesn't exist!</h1>");
    }

    if (req.cookies.user) {
        return res.render("singleUrl", {
            shortUrl: url.shortUrl,
            longUrl: url.longUrl,
        });
    } else {
        res.send("<h1>Please login to access this URL!</h1>");
    }
});

module.exports = urlsRouter;
