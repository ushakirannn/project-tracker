const router = require('express').Router();
const controller = require('../controllers/activities.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:type/:id', controller.getByEntity);

module.exports = router;
