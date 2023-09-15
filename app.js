const express = require("express");
const authRouter=require("./routes/auth.js")
const app = express();

app.set("view engine", "ejs")

app.use("/auth", authRouter)

app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

app.get("/urls", (req,res)=>{
    res.render("urls.ejs")
})

app.post("/logout", (req,res)=>{
    res.redirect("/auth/login");
})

app.listen(3000, () => {
    console.log("Server running at 3000");
});
