const local = require("./local");
const kakao = require("./kakao");
const {pool} = require("../modules/mysql-conn");

module.exports = (passport) => {
    passport.serializeUser((user,done) =>{
        done(null,user.id)
    });

    passport.deserializeUser(async (id,done) => {
        let sql,result,user;
        sql="SELECT * FROM user WHERE id=?";
        try {
        connect = await pool.getConnection();
        result = await connect.query(sql,[id]);
        connect.release();
        user - result[0][0];
        done(null,user)
        }
        catch(error) {
            connect.release();
            done(error)
        }
    });
    
    local(passport);
    //kakao(passport)
}