const mongoose = require('mongoose');

// Stores only recruiter contact details keyed by their external system ID.
const recruiterSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true },
  contactEmail: { type: String, lowercase: true, trim: true },
  contactPhone: { type: String, trim: true },
});

module.exports = mongoose.model('Recruiter', recruiterSchema);
