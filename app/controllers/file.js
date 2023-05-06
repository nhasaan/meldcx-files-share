const { v4: uuid4 } = require('uuid');
const catchAsync = require('../utils/catch-async');
const fileService = require('../services/file');
const AppError = require('../utils/app-error');

const findFile = catchAsync(async (req, res, next) => {
  const fileKey = req.params.fileKey;

  try {
    const file = await fileService.findFileByKey({ fileKey });
    if (!file) {
      return next(new AppError('Could not find file reference', 404));
    }
    return res.json(file);
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

const findFiles = catchAsync(async (req, res, next) => {

  try {
    const files = await fileService.findFiles({ offset: 10 });
    if (!files) {
      return next(new AppError('Could not find file reference', 404));
    }
    return res.json(files);
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

const uploadFiles = catchAsync(async (req, res, next) => {
  try {
    const files = fileService.uploadFiles(req);
    if(!files) {
      return next(new AppError('Could not upload files', 500));
    }
    return res.json(files);
  } catch (error) {
    console.log(error);
    return next(new AppError('Could not upload files', 500));
  }
});

const removeFile = catchAsync(async (req, res, next) => {
  const fileKey = req.params.fileKey;

  try {
    const file = await fileService.removeFileByKey({ fileKey });
    
    if(!file) {
      return next(new AppError('Could not find file reference', 404));
    }
    return res.json({message: 'deleted', status: 'success'})
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  findFile,
  findFiles,
  uploadFiles,
  removeFile,
};
