const express = require("express");
const app = express();
const path = require("path");
const createError = require('http-errors');
require("dotenv").config();

const upload = require("./modules/multer-conn") //모듈화 시킨 객체로 받아오기.



/*  Server */
app.listen(process.env.PORT, () => {
    console.log("http://127.0.0.1:"+ process.env.PORT)
});

/* Setting */
app.set("view engine","pug");
app.set("views",path.join(__dirname,"./views"));
app.locals.pretty = true;

/* MiddleWare */
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use("/", express.static(path.join(__dirname, "./public"))); 

/* File Upload */
app.post("/save",upload.single("upfile"), (req,res,next) => {  //"form name"
    res.send( "upload success" );
});
app.get("/", (req,res,next) => {
    res.render("test/upload.pug")
})