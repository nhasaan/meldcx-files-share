const multer = require('multer');
const { v4: uuid4 } = require('uuid');
const path = require('path');
const File = require('../models/file');

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.FOLDER || 'uploads/'),
  filename: (req, file, cb) => {
    const uniqname = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqname);
  },
});

let uploads = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_MB) * 1024 * 1024, // 5 MB
  },
}).array('files', parseInt(process.env.MAX_FILE_COUNT) || 5);

const uploadFiles = async (req, res) => {
  if (!(req.files.length > 0)) {
    return res.status(400).json({
      error: 'Files missing',
    });
  }

  uploads(req, res, async (err) => {
    if (err) {
      return res.status(500).send({
        error: err.message,
      });
    }
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    const fileUrl = `${process.env.APP_BASE_URL}/files/${response.uuid}`;
  });
};

module.exports = { uploadFiles };
