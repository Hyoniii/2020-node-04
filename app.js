const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

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
app.use("/", express.static(path.join(__dirname, "./public"))); //일종의 라우터. 근데 루트이기 때문에 라우터들 제일 위쪽에 위치해야한다.

/* Router */
const boardRouter = require("./routes/board")
app.use("/board",boardRouter)