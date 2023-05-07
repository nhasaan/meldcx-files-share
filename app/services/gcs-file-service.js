const util = require('util');
const GCS = require('../gcs');

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
  if (!req.files) {
    return next();
  }

  let promises = [];
  let vals = Object.values(req.files);

  for (let f of vals) {
    const gcsname = Date.now() + f[0].originalname;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: f[0].mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      f[0].cloudStorageError = err;
      next(err);
    });

    stream.end(f[0].buffer);

    promises.push(
      new Promise((resolve, reject) => {
        stream.on('finish', () => {
          f[0].cloudStorageObject = gcsname;
          file.makePublic().then(() => {
            f[0].cloudStoragePublicUrl = getPublicUrl(gcsname);
            resolve();
          });
        });
      })
    );
  }
  Promise.all(promises).then(() => next());
};

module.exports = { uploadFile, uploadFiles };
