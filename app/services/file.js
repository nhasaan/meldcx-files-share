const { v4: uuid4 } = require('uuid');
const File = require('../models/file');
const localFileService = require('./local-file-service');
const gcsFileService = require('./gcs-file-service');

const createFile = async (req) => {
  const file = new File({
    filename: req.file.filename,
    key: uuid4(),
    path: req.file.path,
    size: req.file.size,
    ip: req.headers['x-real-ip'] || req.connection.remoteAddress,
  });

  return file.save();
};

const uploadFiles = async (req) => {
  const provider = process.env.PROVIDER || 'local';

  if (provider === 'local') {
    return uploadFilesToLocal(req);
  }
  if (provider === 'gcs') {
    return uploadFilesToGCS(req);
  }
};

const uploadFilesToLocal = (req) => {
  console.log('upload files to local!');
  return localFileService.uploadFiles(req);
};
const uploadFilesToGCS = (req) => {
  console.log('upload files to local!');
  return gcsFileService.sendFiles(req);
};

const findFileByKey = async ({ fileKey }) => {
  const file = await File.findOne({
    key: fileKey,
  }).exec();

  console.log(file);
  return file;
};

const findFiles = async ({ fileKey }) => {
  const files = await File.find({}).skip(0).limit(10).exec();
  return files;
};

const removeFileByKey = async ({ fileKey }) => {
  const file = await File.findOneAndRemove({
    key: fileKey,
  }).exec();

  console.log(file);
  return file;
};

module.exports = {
  createFile,
  findFileByKey,
  removeFileByKey,
  findFiles,
  uploadFiles,
};
