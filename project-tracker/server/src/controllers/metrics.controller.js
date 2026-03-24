const ProjectMetric = require('../models/ProjectMetric');
const MetricSnapshot = require('../models/MetricSnapshot');

// --- Project Metrics (definitions) ---

exports.getByProject = async (req, res, next) => {
  try {
    const metrics = await ProjectMetric.find({ project: req.params.projectId })
      .sort({ createdAt: 1 });
    res.json(metrics);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const metric = await ProjectMetric.create({
      project: req.params.projectId,
      metricName: req.body.metricName,
      metricUnit: req.body.metricUnit || '',
    });
    res.status(201).json(metric);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const metric = await ProjectMetric.findByIdAndUpdate(
      req.params.id,
      { metricName: req.body.metricName, metricUnit: req.body.metricUnit },
      { new: true },
    );
    if (!metric) return res.status(404).json({ message: 'Metric not found' });
    res.json(metric);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const metric = await ProjectMetric.findByIdAndDelete(req.params.id);
    if (!metric) return res.status(404).json({ message: 'Metric not found' });
    await MetricSnapshot.deleteMany({ metric: metric._id });
    res.json({ message: 'Metric deleted' });
  } catch (error) {
    next(error);
  }
};

// --- Metric Snapshots (release level) ---

exports.getSnapshotsByRelease = async (req, res, next) => {
  try {
    const snapshots = await MetricSnapshot.find({ release: req.params.releaseId })
      .populate('metric', 'metricName metricUnit');
    res.json(snapshots);
  } catch (error) {
    next(error);
  }
};

exports.saveSnapshots = async (req, res, next) => {
  try {
    const { releaseId } = req.params;
    const { snapshots } = req.body; // [{ metricId, previousValue, currentValue }]

    // Delete existing snapshots for this release and re-create
    await MetricSnapshot.deleteMany({ release: releaseId });

    const docs = [];
    for (const s of snapshots) {
      if (s.previousValue == null && s.currentValue == null) continue;
      const doc = new MetricSnapshot({
        release: releaseId,
        metric: s.metricId,
        previousValue: s.previousValue || 0,
        currentValue: s.currentValue || 0,
      });
      await doc.save(); // triggers pre-save for percentageChange
      docs.push(doc);
    }

    const populated = await MetricSnapshot.find({ release: releaseId })
      .populate('metric', 'metricName metricUnit');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// --- Standalone snapshot (not tied to a release) ---

exports.createSnapshot = async (req, res, next) => {
  try {
    const { metricId, previousValue, currentValue, note } = req.body;
    if (previousValue == null || currentValue == null) {
      return res.status(400).json({ message: 'previousValue and currentValue are required' });
    }
    const doc = new MetricSnapshot({
      metric: metricId,
      previousValue,
      currentValue,
      note: note || '',
    });
    await doc.save();
    const populated = await MetricSnapshot.findById(doc._id)
      .populate('metric', 'metricName metricUnit')
      .populate('release', 'version');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// --- All snapshots for a metric (history timeline) ---

exports.getSnapshotsByMetric = async (req, res, next) => {
  try {
    const snapshots = await MetricSnapshot.find({ metric: req.params.metricId })
      .populate('release', 'version releaseDate')
      .sort({ createdAt: -1 });
    res.json(snapshots);
  } catch (error) {
    next(error);
  }
};

// --- Latest snapshot values per project (for metrics tab) ---

exports.getLatestByProject = async (req, res, next) => {
  try {
    const metrics = await ProjectMetric.find({ project: req.params.projectId }).lean();
    const metricIds = metrics.map(m => m._id);

    // Get the latest snapshot for each metric (could be from a release or standalone)
    const latestSnapshots = await MetricSnapshot.aggregate([
      { $match: { metric: { $in: metricIds } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$metric', snapshot: { $first: '$$ROOT' } } },
    ]);

    const snapshotMap = {};
    const releaseIds = [];
    latestSnapshots.forEach(s => {
      snapshotMap[s._id.toString()] = s.snapshot;
      if (s.snapshot.release) releaseIds.push(s.snapshot.release);
    });

    // Fetch release names for snapshots that have them
    const Release = require('../models/Release');
    const releases = await Release.find({ _id: { $in: releaseIds } }).select('version').lean();
    const releaseMap = {};
    releases.forEach(r => { releaseMap[r._id.toString()] = r.version; });

    const result = metrics.map(m => {
      const snap = snapshotMap[m._id.toString()] || null;
      return {
        ...m,
        latestSnapshot: snap,
        latestRelease: snap?.release ? releaseMap[snap.release.toString()] || null : null,
        latestSource: snap ? (snap.release ? 'release' : (snap.note || 'Manual entry')) : null,
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};
