const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, process.env.CONFIG || '../../keys.json')

const { Storage } = Cloud;

const GCS = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.PROJECT_ID,
})

module.exports = GCS