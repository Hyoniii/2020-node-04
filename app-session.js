const express = require("express");
const app = express();
const path = require("path");
const createError = require('http-errors');
const session = require("express-session"); //함수형태로 리턴
const mySqlSession = require("express-mysql-session")(session);
const {alert} = require("./modules/util.js")
require("dotenv").config();
const {pool} = require("./modules/mysql-conn");  //dotenv를 불러와야 pool사용가능
const { test } = require("./modules/auth-conn")


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
/* app.use("/upload", express.static(path.join(__dirname, "./upload")));  */
app.use("/storage", express.static(path.join(__dirname, "./upload")));  

/* Session */
const sessionStore = new mySqlSession({},pool)
app.use(session({         //함수로 리턴한걸 사용()해서 미들웨어 세우는 것
    key: "node-board",
    secret: process.env.PASS_SALT,
    resave: false,
    saveUninitialized:false,
    cookie: {
        httpOnly: true,
        secure: process.env.SERVICE === "production" ? true : false
    },
    store: sessionStore 
    /* new mySqlSession({
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        database:process.env.DB_DATABASE,
    }) */
})); 


/* Router */
const boardRouter = require("./routes/board")
const userRouter = require("./routes/user")
app.use("/board",boardRouter)
app.use("/user",userRouter)
app.use("/",(req,res,next) => {
    res.redirect("/user/login")
})


/* 예외처리 , 위치는 꼭 라우터 아래*/
app.use((req,res,next)=> {  //라우터가 없기 때문에 위 과정에서 해당하지 않는 모든 라우터에 해당
    next(createError(404));
})

app.use((err,req,res,next) => {
    res.locals.message = err.message   //뷰엔진의 전역변수 객체, 실제서버에서는 이부분을 지우면 된다.(클라이언트에게 안보이게)
    if (err.message == "File Too Large") {
         res.send(alert("업로드 용량을 초과하였습니다.","/board/list"));
    }
    else {
        res.render("error.pug");   //locals를 사용해서 따로 변수를 보내주지 않아도 된다.
        res.locals.status = (err.status || 500) + " error";
    }
});