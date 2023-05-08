const Cloud = require('@google-cloud/storage')
const serviceKey = process.env.CONFIG

const { Storage } = Cloud;

const GCS = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.PROJECT_ID,
})

module.exports = GCS