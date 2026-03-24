const Activity = require('../models/Activity');

exports.getAll = async (req, res, next) => {
  try {
    const { entityType, entityId, user, limit = 50 } = req.query;
    const filter = {};
    if (entityType) filter.entityType = entityType;
    if (entityId) filter.entityId = entityId;
    if (user) filter.user = user;

    const activities = await Activity.find(filter)
      .populate('user', 'name email avatar')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(activities);
  } catch (error) {
    next(error);
  }
};

exports.getByEntity = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const activities = await Activity.find({ entityType: type, entityId: id })
      .populate('user', 'name email avatar')
      .sort({ timestamp: -1 });
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
