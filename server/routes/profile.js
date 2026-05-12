const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const ResumeParser = require('simple-resume-parser');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

// Use memory storage so we can read the buffer for parsing before uploading
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF, DOC, DOCX allowed'));
  }
});

async function parseResume(buffer, originalname) {
  const ext = path.extname(originalname) || '.pdf';
  const tmpPath = path.join(os.tmpdir(), `resume-${Date.now()}${ext}`);
  fs.writeFileSync(tmpPath, buffer);
  try {
    const parser = new ResumeParser(tmpPath);
    const data = await parser.parseToJSON();
    return data;
  } finally {
    try { fs.unlinkSync(tmpPath); } catch (_) {}
  }
}

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.user;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload resume + parse into profile
router.post('/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { buffer, originalname, mimetype, size } = req.file;
    const key = `resumes/${req.user._id}-${Date.now()}${path.extname(originalname)}`;

    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || 'neuro-resumes',
      Key: key,
      Body: buffer,
      ContentType: mimetype
    }));

    const region = process.env.AWS_REGION || 'us-east-1';
    const bucket = process.env.AWS_S3_BUCKET || 'neuro-resumes';
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    const resumeData = { filename: key, url, originalName: originalname, mimetype, size, uploadDate: new Date() };

    // Parse resume
    let profileUpdate = { resume: resumeData };
    let parseError = null;
    try {
      const parsed = await parseResume(buffer, originalname);

      const set = (key, val) => {
        if (val !== null && val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0)) {
          profileUpdate[key] = val;
        }
      };

      set('fullName', parsed.name);
      set('email', parsed.email);
      set('phone', parsed.phone);
      set('linkedin', parsed.linkedin);
      set('portfolio', parsed.github || parsed.portfolio);
      set('technicalSkills', Array.isArray(parsed.skills) ? parsed.skills : []);

      if (Array.isArray(parsed.experience) && parsed.experience.length > 0) {
        profileUpdate.experience = parsed.experience.map(e => ({
          role: e.title || e.role || '',
          company: e.company || '',
          location: e.location || '',
          duration: e.duration || e.dates || '',
          summary: e.summary || e.description || '',
        }));
      }

      if (Array.isArray(parsed.education) && parsed.education.length > 0) {
        profileUpdate.education = parsed.education.map(e => ({
          degree: e.degree || e.qualification || '',
          institution: e.institution || e.school || e.university || '',
          duration: e.duration || e.dates || '',
          gpa: e.gpa || '',
          coursework: e.coursework || '',
        }));
      }
    } catch (err) {
      parseError = err.message;
      console.error('Resume parsing failed:', err.message);
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      profileUpdate,
      { new: true, upsert: true }
    );

    res.json({
      message: parseError
        ? 'Resume uploaded. Parsing partially failed — some fields may be missing.'
        : 'Resume uploaded and profile updated from resume.',
      profile,
      parseError: parseError || undefined
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete resume
router.delete('/resume', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (profile?.resume?.filename) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET || 'neuro-resumes',
          Key: profile.resume.filename
        }));
      } catch (err) {
        console.error('S3 delete failed:', err.message);
      }
    }
    const updated = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $unset: { resume: 1 } },
      { new: true }
    );
    res.json({ message: 'Resume deleted successfully', profile: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/privacy-policy', (req, res) => {
  res.json({ data: '<h1>Privacy Policy</h1>' });
});

router.get('/terms-conditions', (req, res) => {
  res.json({ data: '<h1>Terms & Conditions</h1>' });
});

module.exports = router;
