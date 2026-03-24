const router = require('express').Router();
const controller = require('../controllers/roadmap.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/upcoming', controller.getUpcoming);
router.get('/project/:projectId', controller.getByProject);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/override-status', controller.overrideStatus);
router.put('/:id/clear-override', controller.clearOverride);
router.delete('/:id', controller.delete);

module.exports = router;
