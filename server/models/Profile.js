const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Basic Info
  fullName: { type: String, trim: true },
  headline: { type: String, trim: true },
  location: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  dateOfBirth: { type: Date },
  nationality: { type: String, trim: true },
  professionalSummary: { type: String },
  languages: [{
    language: { type: String, trim: true },
    proficiency: { type: String, trim: true }
  }],

  // Skills
  designTools: [{ type: String }],
  technicalSkills: [{ type: String }],
  softSkills: [{ type: String }],

  // Experience
  experience: [{
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    location: { type: String, trim: true },
    duration: { type: String, trim: true },
    summary: { type: String },
    achievements: [{ type: String }]
  }],

  // Education
  education: [{
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    duration: { type: String, trim: true },
    gpa: { type: String, trim: true },
    coursework: { type: String }
  }],

  // Projects
  projects: [{
    title: { type: String, trim: true },
    description: { type: String },
    tags: [{ type: String }],
    githubLink: { type: String, trim: true },
    liveLink: { type: String, trim: true }
  }],

  // Job Preferences
  jobPreferences: {
    desiredRole: { type: String, trim: true },
    expectedSalary: { type: String, trim: true },
    preferredLocations: [{ type: String }],
    availability: { type: String, trim: true }
  },

  // Resume
  resume: {
    filename: { type: String },
    originalName: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    url: { type: String },
    uploadDate: { type: Date, default: Date.now }
  },

  // Activity (optional, can be calculated)
  applicationsSent: { type: Number, default: 0 },
  profileViews: { type: Number, default: 0 },
  interviewInvites: { type: Number, default: 0 },
  savedJobs: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);