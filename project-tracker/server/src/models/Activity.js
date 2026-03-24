const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  entityType: {
    type: String,
    enum: ['project', 'task', 'sprint', 'release', 'discussion', 'comment'],
    required: true,
  },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  entityName: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

activitySchema.index({ timestamp: -1 });
activitySchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model('Activity', activitySchema);
