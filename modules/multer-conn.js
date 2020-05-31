const fs = require("fs"); //노드가 가지고 있는 파일 처리를 위한 파일시스템
const path = require("path");
const moment = require("moment");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, makeFolder())
      },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });

const upload = multer({ storage });

function makeFolder() {
    const folderName = moment().format("YYMMDD");
    const newPath = path.join(__dirname,"../upload/"+folderName)
    if (!fs.existsSync(newPath)) {     // 파일명으로 파일유무 확인해주는 파일시스템의 기능 <https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_fs_existssync_path>
        fs.mkdir(newPath, (err) => {
            if(err) next(err);
            return newPath;
        });
    }
    return newPath;
    }

module.exports = upload;