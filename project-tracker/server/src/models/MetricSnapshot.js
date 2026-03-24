const mongoose = require('mongoose');

const metricSnapshotSchema = new mongoose.Schema({
  release: { type: mongoose.Schema.Types.ObjectId, ref: 'Release' },
  metric: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMetric', required: true },
  previousValue: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  percentageChange: { type: Number },
  note: { type: String },
}, {
  timestamps: true,
});

metricSnapshotSchema.pre('save', function () {
  if (this.previousValue !== 0) {
    this.percentageChange = Math.round(((this.currentValue - this.previousValue) / this.previousValue) * 10000) / 100;
  } else {
    this.percentageChange = this.currentValue > 0 ? 100 : 0;
  }
});

metricSnapshotSchema.index({ release: 1 });
metricSnapshotSchema.index({ metric: 1 });

module.exports = mongoose.model('MetricSnapshot', metricSnapshotSchema);
