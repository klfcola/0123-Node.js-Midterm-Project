const express = require("express");
const app = express();

app.get("/", (req, res) => {
    // if(
    //     // User login information
    //     ){
    res.redirect("/urls");
    // }else{
    //     res.redirect("/login")
    // }
});

app.get("/urls", (req, res) => {
    res.send("This is urls page");
});

app.listen(3000, () => {
    console.log("Server running at 3000");
});
