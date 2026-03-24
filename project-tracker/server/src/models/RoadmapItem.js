const mongoose = require('mongoose');

const roadmapItemSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'delayed'],
    default: 'planned',
  },
  isStatusOverridden: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  startDate: { type: Date },
  targetDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

roadmapItemSchema.index({ project: 1, status: 1 });
roadmapItemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('RoadmapItem', roadmapItemSchema);
