const mongoose = require('mongoose');

const projectMetricSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  metricName: { type: String, required: true },
  metricUnit: { type: String, default: '' },
}, {
  timestamps: true,
});

projectMetricSchema.index({ project: 1 });

module.exports = mongoose.model('ProjectMetric', projectMetricSchema);
