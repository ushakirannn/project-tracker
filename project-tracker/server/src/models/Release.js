const mongoose = require('mongoose');

const releaseSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
  version: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  description: { type: String },
  changes: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

releaseSchema.index({ version: 'text', description: 'text' });

module.exports = mongoose.model('Release', releaseSchema);
