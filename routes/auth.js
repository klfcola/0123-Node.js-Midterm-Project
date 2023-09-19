const express = require("express");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
// const popup=require("popups")
const notifier = require("node-notifier");
const app = express();
const authRouter = express.Router();

app.set("view engine", "ejs");
authRouter.use(cookieParser());
authRouter.use(express.urlencoded({ extended: true }));

authRouter.get("/login", (req, res) => {
    // console.log("cookie", req.cookies.user);
    if (req.cookies.user) {
        res.redirect("/urls");
    } else {
        res.render("login.ejs", { auth : true });
    }
    // console.log("RES",res.req)
    // Object.keys(res.req).forEach(val=>{
    //     console.log("key:",val)
    // })
});

authRouter.get("/register", (req, res) => {
    if (req.cookies.user) {
        res.redirect("/urls");
    } else {
        res.render("register.ejs", { auth : true });
    }
});

authRouter.post("/login", (req, res) => {
    // console.log("login",req.body)
    fs.readFile("./models/users.json", (err, data) => {
        if (err) {
            console.log("err", err);
        } else {
            // console.log("users.json",JSON.parse(data))
            let aa = false;
            let id;
            Object.keys(JSON.parse(data)).forEach((val, key) => {
                // console.log(req.body.email," vs ",JSON.parse(data)[val].email,req.body.email==JSON.parse(data)[val].email)
                // console.log(req.body.password," vs ",JSON.parse(data)[val].password,req.body.password==JSON.parse(data)[val].password)
                if (
                    !aa &&
                    req.body.email == JSON.parse(data)[val].email &&
                    req.body.password == JSON.parse(data)[val].password
                ) {
                    //User matches
                    // console.log("TRUE")
                    id=JSON.parse(data)[val].id;
                    aa = true;
                }
            });

            if (aa) {
                res.cookie("user", {
                    id: id,
                    email: req.body.email.toString()
                });
                // console.log("cookie", req.cookies.user);
                res.redirect("/urls");
            } else {
                // Show some alert
                // popup.alert({contetnt:"Login Failed"})
                notifier.notify("Login Failed");
                console.log("Login Failed");
            }
        }
    });
});

authRouter.post("/register", (req, res) => {
    // console.log("Registered",req.body)
    fs.readFile("./models/users.json", (err, data) => {
        if (err) {
            console.log("err", err);
        } else {
            let aa = false;
            Object.keys(JSON.parse(data)).forEach((val, key) => {
                if (!aa && req.body.email == JSON.parse(data)[val].email) {
                    aa = true;
                }
            });

            if (aa) {
                notifier.notify("Email already used");
            } else {
                // Show some alert
                // console.log("Data1",JSON.parse(data))
                const uuid = uuidv4();
                // console.log("Data2",{...JSON.parse(data),ww:{test:"test"}})
                const Data = JSON.stringify(
                    {
                        ...JSON.parse(data),
                        [uuid]: {
                            id: uuid,
                            email: req.body.email,
                            password: req.body.password,
                        },
                    },
                    null,
                    4
                );
                fs.writeFile("./models/users.json", Data, (err) => {
                    if (err) {
                        console.log("err", err);
                    }
                });
                res.redirect("/auth/login");
            }
        }
    });
});

module.exports = authRouter;
