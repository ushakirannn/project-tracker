const Sprint = require('../models/Sprint');
const Task = require('../models/Task');
const logActivity = require('../middleware/activity');

exports.getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const sprints = await Sprint.find(filter).sort({ startDate: -1 });
    res.json(sprints);
  } catch (error) {
    next(error);
  }
};

exports.getCurrent = async (req, res, next) => {
  try {
    const sprint = await Sprint.findOne({ status: 'active' }).sort({ startDate: -1 });
    if (!sprint) {
      return res.status(404).json({ message: 'No active sprint found' });
    }

    const tasks = await Task.find({ sprint: sprint._id })
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ sprint, tasks });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const tasks = await Task.find({ sprint: sprint._id })
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ status: 1, createdAt: -1 });

    res.json({ sprint, tasks });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const sprint = await Sprint.create(req.body);

    await logActivity({
      userId: req.user._id,
      action: 'created',
      entityType: 'sprint',
      entityId: sprint._id,
      entityName: sprint.name,
    });

    res.status(201).json(sprint);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const oldStatus = sprint.status;
    Object.assign(sprint, req.body);
    await sprint.save();

    const metadata = {};
    if (oldStatus !== sprint.status) {
      metadata.field = 'status';
      metadata.from = oldStatus;
      metadata.to = sprint.status;
    }

    await logActivity({
      userId: req.user._id,
      action: 'updated',
      entityType: 'sprint',
      entityId: sprint._id,
      entityName: sprint.name,
      metadata: Object.keys(metadata).length ? metadata : undefined,
    });

    res.json(sprint);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    // Unassign tasks from this sprint
    await Task.updateMany({ sprint: sprint._id }, { $unset: { sprint: 1 } });

    await logActivity({
      userId: req.user._id,
      action: 'deleted',
      entityType: 'sprint',
      entityId: sprint._id,
      entityName: sprint.name,
    });

    await sprint.deleteOne();
    res.json({ message: 'Sprint deleted' });
  } catch (error) {
    next(error);
  }
};
