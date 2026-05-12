const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  contactEmail: { type: String, lowercase: true, trim: true },
  contactPhone: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

recruiterSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

recruiterSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Recruiter', recruiterSchema);
