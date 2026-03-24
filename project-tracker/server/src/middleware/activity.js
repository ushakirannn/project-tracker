const Activity = require('../models/Activity');

const logActivity = async ({ userId, action, entityType, entityId, entityName, metadata }) => {
  try {
    await Activity.create({
      user: userId,
      action,
      entityType,
      entityId,
      entityName,
      metadata,
    });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = logActivity;
