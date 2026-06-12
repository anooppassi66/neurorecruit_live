const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiterId: { type: String, required: true },
  recruiterName: { type: String, trim: true },
  recruiterEmail: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  skills: [{ type: String, trim: true }],
  city: { type: String, trim: true },
  hourlyRate: { type: String, trim: true },
  contactEmail: { type: String, trim: true },
  contactPhone: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.index({ title: 'text', description: 'text' });

jobSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);
