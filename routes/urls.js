const express = require("express");
const fs = require("fs");
const app = express();
const urlsRouter = express.Router();
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
urlsRouter.use(cookieParser());

urlsRouter.get("/", (req, res) => {
    if (req.cookies.user) {
        fs.readFile("./models/urls.json", (err, data) => {
            if(err){
                console.log("err", err)
            }else{
                // console.log("data",data)
                res.render("urls.ejs",{ data : JSON.parse(data) });
            }
        })
    } else {
        res.status(401).send("Invaild access!");
    }
});

urlsRouter.get("/new", (req, res) => {
    if (req.cookies.user) {
        res.render("newUrl");
    } else {
        res.redirect("/auth/login");
    }
});

module.exports = urlsRouter;
