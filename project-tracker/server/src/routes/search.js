const router = require('express').Router();
const controller = require('../controllers/search.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.get('/', controller.search);

module.exports = router;
