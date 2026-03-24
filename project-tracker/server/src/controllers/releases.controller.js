const Release = require('../models/Release');
const logActivity = require('../middleware/activity');

const populateFields = [
  { path: 'project', select: 'name' },
  { path: 'sprint', select: 'name startDate endDate' },
  { path: 'createdBy', select: 'name email avatar' },
];

exports.getAll = async (req, res, next) => {
  try {
    const { project } = req.query;
    const filter = {};
    if (project) filter.project = project;

    const releases = await Release.find(filter)
      .populate(populateFields)
      .sort({ releaseDate: -1 });

    res.json(releases);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const release = await Release.findById(req.params.id).populate(populateFields);
    if (!release) {
      return res.status(404).json({ message: 'Release not found' });
    }
    res.json(release);
  } catch (error) {
    next(error);
  }
};

exports.getByProject = async (req, res, next) => {
  try {
    const releases = await Release.find({ project: req.params.projectId })
      .populate(populateFields)
      .sort({ releaseDate: -1 });
    res.json(releases);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const release = await Release.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populated = await Release.findById(release._id).populate(populateFields);

    await logActivity({
      userId: req.user._id,
      action: 'created',
      entityType: 'release',
      entityId: release._id,
      entityName: `${populated.project?.name || ''} ${release.version}`,
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) {
      return res.status(404).json({ message: 'Release not found' });
    }

    Object.assign(release, req.body);
    await release.save();

    const populated = await Release.findById(release._id).populate(populateFields);

    await logActivity({
      userId: req.user._id,
      action: 'updated',
      entityType: 'release',
      entityId: release._id,
      entityName: `${populated.project?.name || ''} ${release.version}`,
    });

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const release = await Release.findById(req.params.id).populate('project', 'name');
    if (!release) {
      return res.status(404).json({ message: 'Release not found' });
    }

    await logActivity({
      userId: req.user._id,
      action: 'deleted',
      entityType: 'release',
      entityId: release._id,
      entityName: `${release.project?.name || ''} ${release.version}`,
    });

    await release.deleteOne();
    res.json({ message: 'Release deleted' });
  } catch (error) {
    next(error);
  }
};
