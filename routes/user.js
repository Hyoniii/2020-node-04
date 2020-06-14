const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {alert} = require("../modules/util.js")
const {pool} = require("../modules/mysql-conn");
const passport = require("passport");

const pugVals = {cssFile: "user", jsFile: "user"};
const { isUser, isGuest } = require("../modules/auth-conn")


//router.use(test)

router.get("/login",isGuest,(req,res,next) => {
    pugVals.user=req.session.user;
    res.render("user/login.pug", pugVals)
   
});

router.get("/logout", isUser, (req,res,next) => {
    req.session.destroy();
    req.app.locals.user = null;
    res.send(alert("로그아웃 되었습니다.","/"))
});

router.get("/join", isGuest, (req,res,next) => {
    pugVals.user=req.session.user;
    res.render("user/join.pug", pugVals)
});

router.post('/save',isGuest, async (req, res, next) => {
	let {userid, userpw, username, email} = req.body;
	let connect, sql, result, sqlVals; 
	try {
        connect = await pool.getConnection();
        userpw = await bcrypt.hash(userpw + process.env.PASS_SALT, Number(process.env.PASS_ROUND));
		sql = "INSERT INTO user SET userid=?, userpw=?, username=?, email=?";
		sqlVals = [userid, userpw, username, email];
		result = await connect.query(sql, sqlVals);
		//console.log(result);
		connect.release();
		res.send(alert("회원가입이 완료되었습니다.", "/"));
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

//session이 만들어지기 전이라서 isGuest사용
router.post("/auth",async (req,res,next)=> {
    let {userid,userpw} = req.body;
    passport.authenticate()(req,res,next);
    const done = (err,user,msg) => {
        
    }
    
});



module.exports = router;