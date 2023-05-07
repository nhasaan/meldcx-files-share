const catchAsync = require('../utils/catch-async');
const {
  fileService,
  localFileService,
  gcsFileService,
} = require('../services');
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
  const provider = process.env.PROVIDER || 'local';
  let uploaded;

  try {
    if (provider === 'local') {
      uploaded = await localFileService.uploadFiles(req, res, next);
    }
    if (provider === 'gcs') {
      uploaded = await gcsFileService.uploadFiles(req, res, next);
    }

    if (!uploaded) {
      return next(new AppError('Could not upload files', 500));
    }

    const filesSaved = await fileService.createFiles(req);

    if(!filesSaved) {
      return next(new AppError('Uploaded files not saved', 500));
    }
    return res.status(201).json(filesSaved);
  } catch (error) {
    console.log('e: ', error);
    return next(error);
  }
});

const removeFile = catchAsync(async (req, res, next) => {
  const fileKey = req.params.fileKey;

  try {
    const file = await fileService.removeFileByKey({ fileKey });

    if (!file) {
      return next(new AppError('Could not find file reference', 404));
    }
    return res.json({ message: 'deleted', status: 'success' });
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
