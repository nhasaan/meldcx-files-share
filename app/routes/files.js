const router = require('express').Router();
const fileController = require('../controllers/file-controller');

router
  .route('/files')
  .get(fileController.findFiles)
  .post(fileController.uploadFiles);

router.route('/files/:fileKey').get(fileController.findFile);
router.route('/files/:fileKey').delete(fileController.removeFile);

module.exports = router;
