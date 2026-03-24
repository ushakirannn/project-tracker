const Project = require('../models/Project');
const logActivity = require('../middleware/activity');

exports.getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const projects = await Project.find(filter)
      .populate('owner', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user._id,
      owner: req.body.owner || req.user._id,
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    await logActivity({
      userId: req.user._id,
      action: 'created',
      entityType: 'project',
      entityId: project._id,
      entityName: project.name,
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const oldStatus = project.status;
    Object.assign(project, req.body);
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    const metadata = {};
    if (oldStatus !== project.status) {
      metadata.field = 'status';
      metadata.from = oldStatus;
      metadata.to = project.status;
    }

    await logActivity({
      userId: req.user._id,
      action: 'updated',
      entityType: 'project',
      entityId: project._id,
      entityName: project.name,
      metadata: Object.keys(metadata).length ? metadata : undefined,
    });

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await logActivity({
      userId: req.user._id,
      action: 'deleted',
      entityType: 'project',
      entityId: project._id,
      entityName: project.name,
    });

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};
