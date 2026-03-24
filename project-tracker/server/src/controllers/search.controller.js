const Project = require('../models/Project');
const Task = require('../models/Task');
const Discussion = require('../models/Discussion');
const Release = require('../models/Release');

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ projects: [], tasks: [], discussions: [], releases: [] });
    }

    const regex = new RegExp(q, 'i');

    const [projects, tasks, discussions, releases] = await Promise.all([
      Project.find({ $or: [{ name: regex }, { description: regex }] })
        .select('name description status')
        .limit(5),
      Task.find({ $or: [{ title: regex }, { description: regex }] })
        .populate('project', 'name')
        .select('title status project')
        .limit(10),
      Discussion.find({ $or: [{ title: regex }, { content: regex }] })
        .populate('project', 'name')
        .select('title project createdAt')
        .limit(5),
      Release.find({ $or: [{ version: regex }, { description: regex }] })
        .populate('project', 'name')
        .select('version project releaseDate')
        .limit(5),
    ]);

    res.json({ projects, tasks, discussions, releases });
  } catch (error) {
    next(error);
  }
};
