const router = require('express').Router();

router.post('/', (req, res) => {
  console.log('file upload called!');
})
router.get('/', (req, res) => {
  console.log('get file called!');
})
router.delete('/', (req, res) => {
  console.log('file delete called!');
})

module.exports = router;