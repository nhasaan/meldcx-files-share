const { uploader } = require('../middlewares');

const uploadFiles = async (req, res, next) => {
  try {
    await uploader.uploadFiles(req, res);
    if (!(req.files.length > 0)) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { uploadFiles };
