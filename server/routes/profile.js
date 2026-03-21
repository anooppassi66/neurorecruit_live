const express = require('express');
const multer = require('multer');
const path = require('path');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Configure S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

// Configure multer-s3 for file uploads
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET || 'neuro-resumes',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, `resumes/${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
    }
  }
});

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const updateData = req.body;
    // Remove user field if present to prevent modification
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

// Upload resume
router.post('/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resumeData = {
      filename: req.file.key,
      url: req.file.location,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date()
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { resume: resumeData },
      { new: true, upsert: true }
    );

    res.json({ message: 'Resume uploaded successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete resume
router.delete('/resume', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (profile && profile.resume && profile.resume.filename) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET || 'neuro-resumes',
          Key: profile.resume.filename
        }));
      } catch (err) {
        console.error('Failed to delete from S3', err);
      }
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $unset: { resume: 1 } },
      { new: true }
    );

    res.json({ message: 'Resume deleted successfully', profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;