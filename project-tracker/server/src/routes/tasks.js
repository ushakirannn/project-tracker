const router = require('express').Router();
const controller = require('../controllers/tasks.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/project/:projectId', controller.getByProject);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.put('/:id/status', controller.updateStatus);
router.delete('/:id', controller.delete);

module.exports = router;
