const router = require('express').Router();
const controller = require('../controllers/metrics.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Project metric definitions
router.get('/project/:projectId', controller.getByProject);
router.get('/project/:projectId/latest', controller.getLatestByProject);
router.post('/project/:projectId', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// Standalone snapshot
router.post('/snapshots', controller.createSnapshot);

// Snapshot history for a metric
router.get('/metric/:metricId/history', controller.getSnapshotsByMetric);

// Release metric snapshots
router.get('/release/:releaseId', controller.getSnapshotsByRelease);
router.put('/release/:releaseId', controller.saveSnapshots);

module.exports = router;
