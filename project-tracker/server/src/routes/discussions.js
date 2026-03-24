const router = require('express').Router();
const controller = require('../controllers/discussions.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/project/:projectId', controller.getByProject);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/comments', controller.addComment);
router.post('/:id/create-task', controller.createTask);

module.exports = router;
