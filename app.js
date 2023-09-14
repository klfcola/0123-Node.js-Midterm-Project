const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("This is Home page");
});

app.listen(3000, () => {
    console.log("Server running at 3000");
});
