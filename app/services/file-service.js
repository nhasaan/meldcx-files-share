const { v4: uuid4 } = require('uuid');
const fs = require('fs');
const File = require('../models/file');

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

const createFiles = async (req) => {
  const files = req.files;
  const provider = process.env.PROVIDER || 'local';

  let filesToSave = [];

  for (let file of files) {
    const fileTosave = {
      filename: file.filename,
      key: provider === 'local' ? uuid4() : file.fileKey,
      path: file.path,
      size: file.size,
      ip: req.headers['x-real-ip'] || req.connection.remoteAddress,
    };
    filesToSave.push(fileTosave);
  }
  return File.insertMany(filesToSave);
};

const findFileByKey = async ({ fileKey }) => {
  const file = await File.findOne({
    key: fileKey,
  }).exec();

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

  if(file) {
    const filePath = process.env.FOLDER + '/' + file.filename;

    fs.existsSync(filePath, function(exists) {
      if(exists) {
          console.log('File exists. Deleting now ...');
          fs.unlinkSync(filePath);
      } else {
          console.log('File not found, so not deleting.');
      }
    });
  }
  return file;
};

module.exports = {
  createFile,
  createFiles,
  findFileByKey,
  removeFileByKey,
  findFiles,
};
