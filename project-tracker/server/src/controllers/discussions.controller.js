const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');
const Task = require('../models/Task');
const logActivity = require('../middleware/activity');

const populateFields = [
  { path: 'project', select: 'name' },
  { path: 'createdBy', select: 'name email avatar' },
  { path: 'linkedTask', select: 'title' },
];

exports.getAll = async (req, res, next) => {
  try {
    const { project } = req.query;
    const filter = {};
    if (project) filter.project = project;

    const discussions = await Discussion.find(filter)
      .populate(populateFields)
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id).populate(populateFields);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comments = await Comment.find({ discussion: discussion._id })
      .populate('user', 'name email avatar')
      .sort({ createdAt: 1 });

    res.json({ discussion, comments });
  } catch (error) {
    next(error);
  }
};

exports.getByProject = async (req, res, next) => {
  try {
    const discussions = await Discussion.find({ project: req.params.projectId })
      .populate(populateFields)
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const discussion = await Discussion.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populated = await Discussion.findById(discussion._id).populate(populateFields);

    await logActivity({
      userId: req.user._id,
      action: 'created',
      entityType: 'discussion',
      entityId: discussion._id,
      entityName: discussion.title,
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    Object.assign(discussion, req.body);
    await discussion.save();
    const populated = await Discussion.findById(discussion._id).populate(populateFields);

    await logActivity({
      userId: req.user._id,
      action: 'updated',
      entityType: 'discussion',
      entityId: discussion._id,
      entityName: discussion.title,
    });

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    await Comment.deleteMany({ discussion: discussion._id });

    await logActivity({
      userId: req.user._id,
      action: 'deleted',
      entityType: 'discussion',
      entityId: discussion._id,
      entityName: discussion.title,
    });

    await discussion.deleteOne();
    res.json({ message: 'Discussion deleted' });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = await Comment.create({
      discussion: discussion._id,
      user: req.user._id,
      content: req.body.content,
    });

    const populated = await Comment.findById(comment._id).populate('user', 'name email avatar');

    await logActivity({
      userId: req.user._id,
      action: 'commented on',
      entityType: 'discussion',
      entityId: discussion._id,
      entityName: discussion.title,
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const task = await Task.create({
      title: req.body.title || discussion.title,
      description: req.body.description || discussion.content,
      project: discussion.project,
      createdBy: req.user._id,
      ...req.body,
    });

    discussion.linkedTask = task._id;
    await discussion.save();

    await logActivity({
      userId: req.user._id,
      action: 'created task from discussion',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
    });

    const populated = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};
