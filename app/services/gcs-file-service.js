const util = require('util');
const GCS = require('../gcs');
const { uploader } = require('../middlewares');

const bucketName = process.env.BUCKET || 'bucket_name';
const bucket = GCS.bucket(bucketName);

const { format } = util;

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadFile = async (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, '_'));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream
      .on('finish', () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on('error', () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

const uploadFiles = async (req, res, next) => {
  await uploader.sendFiles(req, res);
  console.log('f: ', req.files);

  if (!req.files) {
    return next();
  }

  let promises = [];
  let vals = Object.values(req.files);
  const files = Object.values(req.files);
  console.log('v: ', vals);

  for (let file of files) {
    const gcsname = Date.now() + file.originalname;
    const bucketFile = bucket.file(gcsname);

    const stream = bucketFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      file.cloudStorageError = err;
      next(err);
    });

    stream.end(file.buffer);

    promises.push(
      new Promise((resolve, reject) => {
        stream.on('finish', () => {
          file.cloudStorageObject = gcsname;
          bucketFile.makePublic().then(() => {
            file.cloudStoragePublicUrl = getPublicUrl(gcsname);
            resolve();
          });
        });
      })
    );
  }
  Promise.all(promises).then(() => next());
};

module.exports = { uploadFile, uploadFiles };
