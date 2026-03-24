const Project = require('../models/Project');
const Task = require('../models/Task');
const Sprint = require('../models/Sprint');
const Activity = require('../models/Activity');

exports.getStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      tasksByStatus,
      activeSprint,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'active' }),
      Project.countDocuments({ status: 'completed' }),
      Task.countDocuments(),
      Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Sprint.findOne({ status: 'active' }).sort({ startDate: -1 }),
    ]);

    let sprintStats = null;
    if (activeSprint) {
      const sprintTasks = await Task.aggregate([
        { $match: { sprint: activeSprint._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      const sprintTotal = sprintTasks.reduce((sum, s) => sum + s.count, 0);
      const sprintCompleted = sprintTasks.find(s => s._id === 'completed')?.count || 0;

      sprintStats = {
        sprint: activeSprint,
        total: sprintTotal,
        completed: sprintCompleted,
        inProgress: sprintTasks.find(s => s._id === 'in-progress')?.count || 0,
        blocked: sprintTasks.find(s => s._id === 'blocked')?.count || 0,
        planned: sprintTasks.find(s => s._id === 'planned')?.count || 0,
        testing: sprintTasks.find(s => s._id === 'testing')?.count || 0,
        progress: sprintTotal > 0 ? Math.round((sprintCompleted / sprintTotal) * 100) : 0,
      };
    }

    const statusMap = {};
    tasksByStatus.forEach(s => { statusMap[s._id] = s.count; });

    res.json({
      projects: { total: totalProjects, active: activeProjects, completed: completedProjects },
      tasks: {
        total: totalTasks,
        planned: statusMap['planned'] || 0,
        inProgress: statusMap['in-progress'] || 0,
        blocked: statusMap['blocked'] || 0,
        testing: statusMap['testing'] || 0,
        completed: statusMap['completed'] || 0,
      },
      currentSprint: sprintStats,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjectsOverview = async (req, res, next) => {
  try {
    const projects = await Project.find().populate('owner', 'name').lean();
    const activeSprint = await Sprint.findOne({ status: 'active' }).sort({ startDate: -1 }).lean();

    const projectIds = projects.map(p => p._id);

    const [openTaskCounts, lastReleases] = await Promise.all([
      Task.aggregate([
        { $match: { project: { $in: projectIds }, status: { $ne: 'completed' } } },
        { $group: { _id: '$project', count: { $sum: 1 } } },
      ]),
      require('../models/Release').aggregate([
        { $match: { project: { $in: projectIds } } },
        { $sort: { releaseDate: -1 } },
        { $group: { _id: '$project', version: { $first: '$version' }, releaseDate: { $first: '$releaseDate' } } },
      ]),
    ]);

    const openTaskMap = {};
    openTaskCounts.forEach(t => { openTaskMap[t._id.toString()] = t.count; });

    const releaseMap = {};
    lastReleases.forEach(r => { releaseMap[r._id.toString()] = r.version; });

    const result = projects.map(p => ({
      _id: p._id,
      name: p.name,
      status: p.status,
      currentFocus: p.currentFocus || null,
      openTasks: openTaskMap[p._id.toString()] || 0,
      currentSprint: activeSprint ? activeSprint.name : null,
      lastRelease: releaseMap[p._id.toString()] || null,
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
      status: { $ne: 'completed' },
    })
      .populate('project', 'name')
      .sort({ priority: 1, deadline: 1 })
      .lean();

    // Sort by priority order: critical, high, medium, low
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 9;
      const pb = priorityOrder[b.priority] ?? 9;
      if (pa !== pb) return pa - pb;
      if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getUpcomingDeadlines = async (req, res, next) => {
  try {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      deadline: { $lte: sevenDaysLater },
      status: { $ne: 'completed' },
    })
      .populate('project', 'name')
      .populate('assignedTo', 'name')
      .sort({ deadline: 1 })
      .lean();

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getRecent = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name avatar')
      .sort({ timestamp: -1 })
      .limit(15);

    res.json(activities);
  } catch (error) {
    next(error);
  }
};
