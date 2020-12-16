const express = require('express')
const app = express()
const nunjucks = require("nunjucks")
const cookieParser = require('cookie-parser')


app.use(express.static("public"));
app.use('/js', express.static("js"));
app.use(cookieParser())

app.set("view engine", "html")
nunjucks.configure('views', {
    autoescape: true,
    express: app
})

app.get("/", (req, res, next) => {
    res.render("index");
});
app.get("/dogs/:name", (req, res, next) => {
    res.render("dog", { name: req.params.name });
});


app.get('/showmecookies', (req, res, next) => {
    res.cookie('isLoggedIn', 'Definitely')
    res.send(req.cookies);
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})