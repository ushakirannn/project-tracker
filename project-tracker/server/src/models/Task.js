const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'blocked', 'testing', 'completed'],
    default: 'planned',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['feature', 'bug', 'improvement', 'research', 'maintenance'],
  },
  startDate: { type: Date },
  deadline: { type: Date },
  deadlineExtension: {
    newDeadline: { type: Date },
    reason: { type: String },
  },
  roadmapItem: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapItem' },
  tags: [{ type: String }],
  attachments: [{
    filename: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);
