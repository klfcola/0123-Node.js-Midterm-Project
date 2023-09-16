const express = require("express");
const authRouter = require("./routes/auth.js");
const urlsRouter = require("./routes/urls.js");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

app.set("view engine", "ejs");

app.use("/auth", authRouter);

app.use("/urls", urlsRouter);

app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

app.get("/urls", (req, res) => {
    if (req.cookies.user) {
        res.render("urls.ejs");
    } else {
        res.status(401).send("Invaild access!");
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("user");
    res.redirect("/auth/login");
});

app.listen(3000, () => {
    console.log("Server running at 3000");
});
