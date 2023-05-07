const fileService = require('./file-service');
const localFileService = require('./local-file-service');
const gcsFileService = require('./gcs-file-service');

module.exports = {
  fileService,
  localFileService,
  gcsFileService,
};
