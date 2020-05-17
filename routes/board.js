const express = require("express");
const path = require("path");
const router = express.Router();
const moment = require("moment");
const { pool } = require("../modules/mysql-conn");
const { alert } = require("../modules/util")

router.get(["","/list"], (req,res,next) => {  //경로를 두가지 이상 쓰고 싶다면 배열로 쓰면 된다.
    const pugVals = {
        cssFile : "board",
        jsFile : "board"
    }
    res.render("board/list.pug", pugVals)
})

router.get("/write", (req,res,next) => {
    const pugVals = {
        cssFile : "board",
        jsFile : "board"
    }
    res.render("board/write.pug", pugVals)
})

router.post("/save", async(req,res,next) => {
   /* const title = req.body.title //리퀘.바디로 받을 수 있는건 app에서 제이슨,유알엘엔코디드를 통해서 가능
    const writer = req.body.writer //리퀘.바디로 받을 수 있는건 app에서 제이슨,유알엘엔코디드를 통해서 가능
    const content = req.body.content //리퀘.바디로 받을 수 있는건 app에서 제이슨,유알엘엔코디드를 통해서 가능
    const created = moment().format("YYYY-MM-DD HH:mm:ss")*/
    const {title, writer, comment, created=moment().format("YYYY-MM-DD HH:mm:ss")} = req.body
    const values = [title,writer,comment,created];
    const sql = "INSERT INTO board SET title=?, writer=?, comment=?, created=?";  //created는 모멘트에서 받는 시간
    let connect, result;
    try {
        connect = await pool.getConnection();
        result = await connect.query(sql,values);
        connect.release();
        //res.json(result);
        if(result[0].affectedRows > 0) res.send(alert("저장되었습니다.","/board"));
        else res.send(alert("에러발생","/board"));
    } 
    catch(err) {
        connect.release();  //커넥트 반납?
        next(err);   //app.js에서 받음
    }
})

module.exports = router