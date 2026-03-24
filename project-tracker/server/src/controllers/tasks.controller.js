const Task = require('../models/Task');
const logActivity = require('../middleware/activity');

const populateFields = [
  { path: 'project', select: 'name' },
  { path: 'sprint', select: 'name' },
  { path: 'assignedTo', select: 'name email avatar' },
  { path: 'createdBy', select: 'name email avatar' },
  { path: 'roadmapItem', select: 'title' },
];

exports.getAll = async (req, res, next) => {
  try {
    const { status, priority, category, assignedTo, sprint, project, tag, roadmapItem } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (sprint) filter.sprint = sprint;
    if (project) filter.project = project;
    if (tag) filter.tags = tag;
    if (roadmapItem) filter.roadmapItem = roadmapItem;

    const tasks = await Task.find(filter)
      .populate(populateFields)
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(populateFields);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id).populate(populateFields);

    await logActivity({
      userId: req.user._id,
      action: 'created',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    const oldAssignee = task.assignedTo?.toString();
    Object.assign(task, req.body);
    await task.save();

    const populated = await Task.findById(task._id).populate(populateFields);

    const metadata = {};
    if (oldStatus !== task.status) {
      metadata.field = 'status';
      metadata.from = oldStatus;
      metadata.to = task.status;
    }
    if (oldAssignee !== task.assignedTo?.toString()) {
      metadata.reassigned = true;
    }

    await logActivity({
      userId: req.user._id,
      action: 'updated',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
      metadata: Object.keys(metadata).length ? metadata : undefined,
    });

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    task.status = req.body.status;
    await task.save();

    const populated = await Task.findById(task._id).populate(populateFields);

    await logActivity({
      userId: req.user._id,
      action: 'updated',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
      metadata: { field: 'status', from: oldStatus, to: task.status },
    });

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await logActivity({
      userId: req.user._id,
      action: 'deleted',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
    });

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getByProject = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { project: req.params.projectId };
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate(populateFields)
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};
