const express = require('express');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const recruiterAuth = require('../middleware/recruiterAuth');

const router = express.Router();
const EXTERNAL_LOGIN = 'https://recruit.neurocruit.ai/api/auth/login';

// Login — proxied to external auth service
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const response = await fetch(EXTERNAL_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(response.status).json({ message: data.error || 'Invalid credentials' });
    }

    // Fetch stored contact details for this recruiter (if any)
    const contactRecord = await Recruiter.findOne({ externalId: String(data.user.id) });

    res.json({
      token: data.token,
      recruiter: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        contactEmail: contactRecord?.contactEmail || '',
        contactPhone: contactRecord?.contactPhone || ''
      }
    });
  } catch {
    res.status(503).json({ message: 'Authentication service unavailable' });
  }
});

// Get current recruiter profile
router.get('/me', recruiterAuth, async (req, res) => {
  const contactRecord = await Recruiter.findOne({ externalId: String(req.recruiter.id) });
  res.json({
    recruiter: {
      id: req.recruiter.id,
      name: req.recruiter.name,
      email: req.recruiter.email,
      contactEmail: contactRecord?.contactEmail || '',
      contactPhone: contactRecord?.contactPhone || ''
    }
  });
});

// Update contact details
router.put('/contact', recruiterAuth, async (req, res) => {
  try {
    const { contactEmail, contactPhone } = req.body;
    const contactRecord = await Recruiter.findOneAndUpdate(
      { externalId: String(req.recruiter.id) },
      { contactEmail, contactPhone },
      { new: true, upsert: true }
    );
    res.json({
      message: 'Contact details updated',
      recruiter: { contactEmail: contactRecord.contactEmail, contactPhone: contactRecord.contactPhone }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get own job posts
router.get('/jobs', recruiterAuth, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: String(req.recruiter.id) }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create job post
router.post('/jobs', recruiterAuth, async (req, res) => {
  try {
    const { title, description, skills, city, hourlyRate } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'title and description are required' });

    const skillsArr = Array.isArray(skills)
      ? skills
      : (skills || '').split(',').map(s => s.trim()).filter(Boolean);

    const contactRecord = await Recruiter.findOne({ externalId: String(req.recruiter.id) });

    const job = await Job.create({
      recruiterId: String(req.recruiter.id),
      recruiterName: req.recruiter.name,
      recruiterEmail: req.recruiter.email,
      title,
      description,
      skills: skillsArr,
      city: city || '',
      hourlyRate: hourlyRate || '',
      contactEmail: contactRecord?.contactEmail || '',
      contactPhone: contactRecord?.contactPhone || ''
    });
    res.status(201).json({ message: 'Job created', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Edit job post
router.put('/jobs/:id', recruiterAuth, async (req, res) => {
  try {
    const { title, description, skills, city, hourlyRate } = req.body;
    const skillsArr = Array.isArray(skills)
      ? skills
      : (skills || '').split(',').map(s => s.trim()).filter(Boolean);

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: String(req.recruiter.id) },
      {
        title,
        description,
        skills: skillsArr,
        city: city || '',
        hourlyRate: hourlyRate || '',
        recruiterName: req.recruiter.name,
        recruiterEmail: req.recruiter.email,
        updatedAt: new Date()
      },
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
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiterId: String(req.recruiter.id) });
    if (!job) return res.status(404).json({ message: 'Job not found or not yours' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
