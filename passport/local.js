const LocalStorategy = require("passport-local").Strategy;
/* http://www.passportjs.org/packages/passport-local/*/
const bcrypt = require("bcrypt");
const {pool} = require("../modules/mysql-conn");



const cb = (userid,userpw,done) => {
    let sql, result,connect;
    try{
        sql = "SELECT * FROM board WHERE userid=?"
        connect = await pool.getConnection();
        result = await connect.query(sql,[userid])
        connect.release();
        if(result[0][0]){
            let compare = await bcrypt.compare(userpw+ process.env.PASS_SALT, result[0][0].userpw)
            if(compare) done(null,result[0][0]);
            else done(null,false,{message:"아이디와 비밀번호를 확인하세요."})
        }else {
            done(null,false,{message:"아이디와 비밀번호를 확인하세요."})

        }
    }catch(error){
        connect.release();
        done(error)
    }
}


module.exports =(passport) => {
    passport.use(new LocalStorategy({
        usernameField: "userid",
        passwordField: "userpw"
    }),cb);
}