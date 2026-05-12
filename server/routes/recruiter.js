const express = require('express');
const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const recruiterAuth = require('../middleware/recruiterAuth');

const router = express.Router();

function makeToken(recruiterId) {
  return jwt.sign(
    { recruiterId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'name, email and password are required' });

    const existing = await Recruiter.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const recruiter = await Recruiter.create({ name, email, password });
    res.status(201).json({
      message: 'Recruiter registered successfully',
      token: makeToken(recruiter._id),
      recruiter: { id: recruiter._id, name: recruiter.name, email: recruiter.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter || !(await recruiter.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      token: makeToken(recruiter._id),
      recruiter: { id: recruiter._id, name: recruiter.name, email: recruiter.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current recruiter
router.get('/me', recruiterAuth, async (req, res) => {
  const r = req.recruiter;
  res.json({ recruiter: { id: r._id, name: r.name, email: r.email, contactEmail: r.contactEmail, contactPhone: r.contactPhone } });
});

// Update contact details
router.put('/contact', recruiterAuth, async (req, res) => {
  try {
    const { contactEmail, contactPhone } = req.body;
    const recruiter = await Recruiter.findByIdAndUpdate(
      req.recruiter._id,
      { contactEmail, contactPhone },
      { new: true }
    );
    res.json({ message: 'Contact details updated', recruiter: { contactEmail: recruiter.contactEmail, contactPhone: recruiter.contactPhone } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get own jobs
router.get('/jobs', recruiterAuth, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.recruiter._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create job post
router.post('/jobs', recruiterAuth, async (req, res) => {
  try {
    const { title, description, skills } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'title and description are required' });

    // skills may arrive as a comma-separated string or an array
    const skillsArr = Array.isArray(skills)
      ? skills
      : (skills || '').split(',').map(s => s.trim()).filter(Boolean);

    const recruiter = req.recruiter;
    const job = await Job.create({
      recruiter: recruiter._id,
      title,
      description,
      skills: skillsArr,
      contactEmail: recruiter.contactEmail || '',
      contactPhone: recruiter.contactPhone || ''
    });
    res.status(201).json({ message: 'Job created', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Edit job post
router.put('/jobs/:id', recruiterAuth, async (req, res) => {
  try {
    const { title, description, skills } = req.body;
    const skillsArr = Array.isArray(skills)
      ? skills
      : (skills || '').split(',').map(s => s.trim()).filter(Boolean);

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.recruiter._id },
      { title, description, skills: skillsArr, updatedAt: new Date() },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found or not yours' });
    res.json({ message: 'Job updated', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job post
router.delete('/jobs/:id', recruiterAuth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.recruiter._id });
    if (!job) return res.status(404).json({ message: 'Job not found or not yours' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
