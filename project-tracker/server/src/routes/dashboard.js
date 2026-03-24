const router = require('express').Router();
const controller = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/stats', controller.getStats);
router.get('/projects-overview', controller.getProjectsOverview);
router.get('/my-tasks', controller.getMyTasks);
router.get('/upcoming-deadlines', controller.getUpcomingDeadlines);
router.get('/recent', controller.getRecent);

module.exports = router;
