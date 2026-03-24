const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  linkedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
}, {
  timestamps: true,
});

discussionSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Discussion', discussionSchema);
