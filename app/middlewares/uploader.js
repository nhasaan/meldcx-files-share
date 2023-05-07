const multer = require('multer');
const path = require('path');
const util = require("util");
const AppError = require('../utils/app-error')

const storage = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${process.env.FOLDER}`);
    },
    filename: (req, file, cb) => {
      const uniqname = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqname);
    },
  });

  return storage;
};

const fileFilter = (req, file, cb) => {
  // for (let file of files) {
    // Accept images only
    if (
      !file.originalname.match(
        /\.(pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/
      )
    ) {
      req.fileValidationError =
        'Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
      return cb(
        new AppError(
          'Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'
        ),
        false
      );
    }
  // }
  cb(null, true);
};


const upload = multer({
  storage: storage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_MB) * 1024 * 1024, // 5 MB
  },
  fileFilter,
});

const uploadFile = util.promisify(upload.single('file'));
const uploadFiles = util.promisify(upload.array('files', parseInt(process.env.MAX_FILE_COUNT) || 5));


module.exports = {
  uploadFile,
  uploadFiles,
};
