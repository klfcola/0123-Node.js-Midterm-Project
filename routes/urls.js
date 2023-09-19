const express = require("express");
const fs = require("fs");
const app = express();
const urlsRouter = express.Router();
const cookieParser = require("cookie-parser");
const notifier = require("node-notifier");
const urlsData = require("../models/urls.json");
const userData = require("../models/users.json");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
urlsRouter.use(cookieParser());
urlsRouter.use(express.urlencoded({ extended: true }));

urlsRouter.get("/", (req, res) => {
    if (req.cookies.user) {
        fs.readFile("./models/urls.json", (err, data) => {
            if (err) {
                console.log("err", err);
            } else {
                // console.log("data",data)
                res.render("urls.ejs", {
                    data: JSON.parse(data),
                    cookie: req.cookies.user,
                });
            }
        });
    } else {
        res.status(401).send("Invaild access!");
    }
});

urlsRouter.get("/new", (req, res) => {
    if (req.cookies.user) {
        res.render("newUrl", { cookie: req.cookies.user });
    } else {
        res.redirect("/auth/login");
    }
});

function generateRandomString() {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
        randomString += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return randomString;
}

function isLoggedIn(req, res, next) {
    if (req.cookies.user) {
        next();
    } else {
        res.status(401).send("Unauthorized. Please log in.");
    }
}

urlsRouter.post("/new", isLoggedIn, (req, res) => {
    fs.readFile("./models/urls.json", (err, data) => {
        if (err) {
            console.log("err", err);
            res.status(500).send("Internal Server Error");
        } else {
            let ab = false;
            const urlDatabase = JSON.parse(data);
            Object.keys(urlDatabase).forEach((val) => {
                if (!ab && req.body.longUrL == urlDatabase[val].longUrl) {
                    ab = true;
                }
            });
            if (ab) {
                notifier.notify("Websitee already shortenedd!!!");
                res.status(400).send("Website already shortened");
            } else {
                const randomDigits = generateRandomString();
                const Data = JSON.stringify(
                    {
                        ...JSON.parse(data),
                        [randomDigits]: {
                            shortUrl: randomDigits,
                            longUrl: "http://" + req.body.longUrl,
                            userId: req.cookies.user.id,
                        },
                    },
                    null,
                    4
                );
                fs.writeFile("./models/urls.json", Data, (err) => {
                    if (err) {
                        console.error("Error writing to urls.json:", err);
                        res.status(500).send("Internal Server Error");
                    } else {
                        console.log("URLs database updated.");
                        res.redirect(req.body.longUrl);
                    }
                });
            }
        }
    });
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
        if (url.userId === req.cookies.user.id) {
            return res.render("singleUrl", {
                shortUrl: url.shortUrl,
                longUrl: url.longUrl,
                cookie: req.cookies.user,
            });
        } else {
            return res.send(
                "<h1>You don't have permission to access this URL!</h1>"
            );
        }
    } else {
        res.send("<h1>Please login to access this URL!</h1>");
    }
});

module.exports = urlsRouter;
