const express = require("express");
const path = require("path");
const router = express.Router();
const moment = require("moment");
const { pool } = require("../modules/mysql-conn");
const { alert } = require("../modules/util")
const pager = require("../modules/pager")

router.get(["/","/list","/list/:page"], async (req,res,next) => {  //경로를 두가지 이상 쓰고 싶다면 배열로 쓰면 된다.
    let page = req.params.page ? Number(req.params.page) : 1;
    let pugVals = {
        cssFile : "board",
        jsFile : "board"
    }
    let connect, result,sql,total
    try {
        connect = await pool.getConnection();
        sql = "SELECT count(id) FROM board"; //보더에 있는 아이디를 내림차순으로 정렬해서 가져와라.
        result = await connect.query(sql);
        total = result[0][0]["count(id)"];
        pagerValues = pager({page,total,list:3, grp:3})
        res.json(pagerValues);
        /*
        sql = "SELECT * FROM board ORDER BY id DESC LIMIT ?,?";
        result = await connect.query(sql,[pagerValues.stIdx, pagerValues.list]);
        connect.release();
    let lists = result[0].map((v)=> {
        v.created = moment(v.created).format("YYYY-MM-DD");
        return v;
    })
    pugVals.lists = lists;
    //res.json(result[0]);
    res.render("board/list.pug", pugVals)
    }*/}
    catch(err) {
        connect.release();
        next(err);
    }
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
        //res.json(result);
        connect.release();
        if(result[0].affectedRows > 0) res.send(alert("저장되었습니다.","/board"));
        else res.send(alert("에러발생","/board"));
    } 
    catch(err) {
        connect.release();  //커넥트 반납?
        next(err);   //app.js에서 받음
    }
})

router.get("/view/:id", async (req,res,next) => {
    let id = req.params.id;
    let pugVals = {
        cssFile : "board",
        jsFile : "board"
    }
    let sql ="SELECT * FROM board WHERE id=?";
    let connect, result;
    try {
        connect = await pool.getConnection();
        result = await connect.query(sql,[id]);
        connect.release();
        //res.json(result[0]);
        pugVals.data = result[0][0]
        pugVals.data.created = moment(pugVals.data.created).format("YYYY-MM-DD HH:mm:ss");
        res.render("board/view.pug",pugVals)
    }
    catch(err) {
        connect.release();
        next(err);

    }
})

router.get("/remove/:id", async (req,res,next) => {
    let id = req.params.id;
    let sql = "DELETE FROM board WHERE id=?";
    let connect, result;
    try{
        connect = await pool.getConnection();
        result = await connect.query(sql,[id]);
        connect.release();
        //res.json(result);
        if(result[0].affectedRows == 1) res.send(alert("삭제되었습니다." , "/board"));
        else res.send(alert("삭제가 실행되지 않았습니다.관리자에게 문의하세요","/board"));
    } 
    catch(err) {
        connect.release();
        next(err);
    }
})

module.exports = router