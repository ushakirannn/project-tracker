const RoadmapItem = require('../models/RoadmapItem');
const Task = require('../models/Task');
const logActivity = require('../middleware/activity');

const populateFields = [
  { path: 'project', select: 'name' },
  { path: 'createdBy', select: 'name email avatar' },
];

function deriveStatusFromTasks(tasks, item) {
  if (tasks.length === 0) return item.status;

  const allCompleted = tasks.every(t => t.status === 'completed');
  if (allCompleted) return 'completed';

  const anyBlocked = tasks.some(t => t.status === 'blocked');
  if (anyBlocked) return 'delayed';

  const anyInProgress = tasks.some(t => ['in-progress', 'testing'].includes(t.status));
  if (anyInProgress) return 'in_progress';

  return 'planned';
}

function applyDateBasedStatus(item) {
  if (item.status === 'planned' && item.startDate && new Date() >= new Date(item.startDate)) {
    item.status = 'in_progress';
  }
}

async function enrichWithDerivedData(item) {
  const obj = item.toObject ? item.toObject() : { ...item };
  const tasks = await Task.find({ roadmapItem: obj._id })
    .populate('sprint', 'name')
    .populate('assignedTo', 'name')
    .lean();

  if (!obj.isStatusOverridden && tasks.length > 0) {
    obj.status = deriveStatusFromTasks(tasks, obj);
  }

  applyDateBasedStatus(obj);

  obj.linkedTasks = tasks;
  obj.taskCount = tasks.length;
  obj.completedTaskCount = tasks.filter(t => t.status === 'completed').length;

  // Derive related sprints from linked tasks
  const sprintMap = {};
  tasks.forEach(t => {
    if (t.sprint) {
      sprintMap[t.sprint._id.toString()] = t.sprint;
    }
  });
  obj.relatedSprints = Object.values(sprintMap);

  return obj;
}

exports.getByProject = async (req, res, next) => {
  try {
    const items = await RoadmapItem.find({ project: req.params.projectId })
      .populate(populateFields)
      .sort({ priority: 1, startDate: 1 });

    const enriched = await Promise.all(items.map(enrichWithDerivedData));
    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await RoadmapItem.findById(req.params.id).populate(populateFields);
    if (!item) return res.status(404).json({ message: 'Roadmap item not found' });

    const enriched = await enrichWithDerivedData(item);
    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await RoadmapItem.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populated = await RoadmapItem.findById(item._id).populate(populateFields);
    const enriched = await enrichWithDerivedData(populated);

    await logActivity({
      userId: req.user._id,
      action: 'created',
      entityType: 'roadmap',
      entityId: item._id,
      entityName: item.title,
    });

    res.status(201).json(enriched);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await RoadmapItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Roadmap item not found' });

    const oldStatus = item.status;
    Object.assign(item, req.body);
    await item.save();

    const populated = await RoadmapItem.findById(item._id).populate(populateFields);
    const enriched = await enrichWithDerivedData(populated);

    const metadata = {};
    if (oldStatus !== item.status) {
      metadata.field = 'status';
      metadata.from = oldStatus;
      metadata.to = item.status;
    }

    await logActivity({
      userId: req.user._id,
      action: 'updated',
      entityType: 'roadmap',
      entityId: item._id,
      entityName: item.title,
      metadata: Object.keys(metadata).length ? metadata : undefined,
    });

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

exports.overrideStatus = async (req, res, next) => {
  try {
    const item = await RoadmapItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Roadmap item not found' });

    item.status = req.body.status;
    item.isStatusOverridden = true;
    await item.save();

    const populated = await RoadmapItem.findById(item._id).populate(populateFields);
    const enriched = await enrichWithDerivedData(populated);

    await logActivity({
      userId: req.user._id,
      action: 'updated',
      entityType: 'roadmap',
      entityId: item._id,
      entityName: item.title,
      metadata: { field: 'status', to: req.body.status, override: true },
    });

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

exports.clearOverride = async (req, res, next) => {
  try {
    const item = await RoadmapItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Roadmap item not found' });

    item.isStatusOverridden = false;
    await item.save();

    const populated = await RoadmapItem.findById(item._id).populate(populateFields);
    const enriched = await enrichWithDerivedData(populated);

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const item = await RoadmapItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Roadmap item not found' });

    // Unlink tasks
    await Task.updateMany({ roadmapItem: item._id }, { $unset: { roadmapItem: 1 } });

    await logActivity({
      userId: req.user._id,
      action: 'deleted',
      entityType: 'roadmap',
      entityId: item._id,
      entityName: item.title,
    });

    await item.deleteOne();
    res.json({ message: 'Roadmap item deleted' });
  } catch (error) {
    next(error);
  }
};

// Dashboard: upcoming roadmap items (startDate within next 30 days)
exports.getUpcoming = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const items = await RoadmapItem.find({
      status: { $ne: 'completed' },
      $or: [
        { startDate: { $lte: thirtyDaysLater } },
        { startDate: null },
      ],
    })
      .populate('project', 'name')
      .populate('createdBy', 'name')
      .sort({ startDate: 1 })
      .limit(10)
      .lean();

    // Enrich with task counts and derived status
    const enriched = await Promise.all(items.map(async (item) => {
      const tasks = await Task.find({ roadmapItem: item._id }).lean();

      if (!item.isStatusOverridden && tasks.length > 0) {
        item.status = deriveStatusFromTasks(tasks, item);
      }
      applyDateBasedStatus(item);

      item.taskCount = tasks.length;
      item.completedTaskCount = tasks.filter(t => t.status === 'completed').length;
      return item;
    }));

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};
