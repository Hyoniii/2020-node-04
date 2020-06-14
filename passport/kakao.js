const KakaoStorategy = require("passport-kakao").Strategy;

const cb = () => {

}

module.exports = (passport) => {
    passport.use(new KakaoStorategy({
        clientID : clientID,
        clientSecret: clientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
        callbackURL : "/board"
    }),cb)
}