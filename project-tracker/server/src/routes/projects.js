const router = require('express').Router();
const controller = require('../controllers/projects.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
