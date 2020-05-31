const fs = require("fs"); //노드가 가지고 있는 파일 처리를 위한 파일시스템
const path = require("path");
const moment = require("moment");
const multer = require("multer");

//multer안에서 움직이는 미들웨어 두개. storage, fileFilter
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, makeFolder())
      },
    filename: function (req, file, cb) {
      cb(null, makeFile(file))
    }
  });

const upload = multer({ storage, fileFilter, limits: {fileSize : 2048000} });



function makeFile(file) {
    let oriName = file.originalname;
    let ext = path.extname(oriName); //<https://nodejs.org/dist/latest-v12.x/docs/api/path.html#path_path_extname_path>
    let newName = moment().format("YYMMDD") + "-" + Date.now() + "-" + Math.floor((Math.random() * 900 + 100)) + ext;
    return newName
}


function makeFolder() {
    const folderName = moment().format("YYMMDD");
    const newPath = path.join(__dirname,"../upload/"+folderName)
    if (!fs.existsSync(newPath)) {     // 파일명으로 파일유무 확인해주는 파일시스템의 기능 <https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_fs_existssync_path>
        fs.mkdir(newPath, (err) => {
            if(err) new Error(err);  //에러가 생겨서 new Error에 걸리면 app.js의 에러처리단으로 보내진다.
            return newPath;
        });
    }
    return newPath;
    }

function fileFilter(req,file,cb) {
    const allowExt = [".jpg", ".jpeg", ".gif", ".png", ".pdf", ".zip"];
    const ext = path.extname(file.originalname).toLowerCase();
    if(allowExt.indexOf(ext) > -1) {
        cb(null,true) 
    }else {
        req.fileChk = ext.substr(1);
        cb(null,false);  //allowExt에서 ext를 찾았다면(-1이상이라는게 있다는 것) 에러는 null이고 true를 반환해주세요. 없다면 에러 null, false반환하세요.
    }
}

module.exports = upload;