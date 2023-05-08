
const fs = require('fs');
const catchAsync = require('../utils/catch-async');
const {
  fileService,
  localFileService,
  gcsFileService,
} = require('../services');
const AppError = require('../utils/app-error');
const SuccessResponse = require('../utils/success-response');

const findFile = catchAsync(async (req, res, next) => {
  const fileKey = req.params.fileKey;

  try {
    const file = await fileService.findFileByKey({ fileKey });
    if (!file) {
      return next(new AppError('Could not find file reference', 404));
    }
    const successResponse = new SuccessResponse("Fetched Successfully", 200, file)
    successResponse.sendResponse(res);
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
    const successResponse = new SuccessResponse("Fetched Successfully", 200, files)
    successResponse.sendResponse(res);
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

    if (!filesSaved) {
      return next(new AppError('Uploaded files not saved', 500));
    }
    const successResponse = new SuccessResponse("Uploaded Successfully", 201, filesSaved)
    successResponse.sendResponse(res);
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

    const successResponse = new SuccessResponse("Removed Successfully", 200)
    successResponse.sendResponse(res);
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
