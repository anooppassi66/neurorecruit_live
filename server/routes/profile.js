const express = require('express');
const multer = require('multer');
const path = require('path');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
};

const s3 = new S3Client(awsConfig);
const bedrock = new BedrockRuntimeClient(awsConfig);

const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0';

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

async function extractText(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const result = await pdfParse(buffer);
    return result.text;
  }
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function parseResumeWithBedrock(text) {
  const prompt = `Extract structured information from the following resume and return ONLY a valid JSON object. Use null for missing scalar fields and [] for missing arrays. Do not include any text outside the JSON.

{
  "fullName": "full name of the candidate",
  "headline": "short professional headline (e.g. 'Senior Full Stack Developer')",
  "location": "city and country",
  "phone": "phone number with country code",
  "dateOfBirth": "YYYY-MM-DD or null",
  "linkedin": "full LinkedIn profile URL or null",
  "portfolio": "portfolio or personal website URL or null",
  "professionalSummary": "2–4 sentence professional summary paragraph",
  "languages": [
    { "language": "English", "proficiency": "Native" }
  ],
  "designTools": ["Figma", "Sketch", "Adobe XD"],
  "technicalSkills": ["JavaScript", "React", "Node.js"],
  "softSkills": ["Leadership", "Communication", "Problem Solving"],
  "experience": [
    {
      "role": "Job title",
      "company": "Company name",
      "location": "City, Country",
      "duration": "Jan 2021 – Mar 2024",
      "summary": "Brief description of responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University name",
      "duration": "2016 – 2020",
      "gpa": "3.8 or null",
      "coursework": "Data Structures, Algorithms, Databases"
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "What the project does and your role",
      "tags": ["React", "Node.js"],
      "githubLink": "https://github.com/... or null",
      "liveLink": "https://... or null"
    }
  ]
}

Resume text:
${text}`;

  const command = new ConverseCommand({
    modelId: BEDROCK_MODEL_ID,
    messages: [{ role: 'user', content: [{ text: prompt }] }],
    inferenceConfig: { maxTokens: 4096 }
  });

  const response = await bedrock.send(command);
  const raw = response.output.message.content[0].text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not extract JSON from Bedrock response');
  return JSON.parse(jsonMatch[0]);
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

    let profileUpdate = { resume: resumeData };
    let parseError = null;

    try {
      const text = await extractText(buffer, mimetype);

      if (!text || text.trim().length < 30) {
        throw new Error('Could not extract readable text from the resume file');
      }

      const parsed = await parseResumeWithBedrock(text);

      const set = (field, val) => {
        if (val === null || val === undefined || val === '') return;
        if (Array.isArray(val) && val.length === 0) return;
        profileUpdate[field] = val;
      };

      set('fullName',            parsed.fullName);
      set('headline',            parsed.headline);
      set('location',            parsed.location);
      set('phone',               parsed.phone);
      set('dateOfBirth',         parsed.dateOfBirth);
      set('linkedin',            parsed.linkedin);
      set('portfolio',           parsed.portfolio);
      set('professionalSummary', parsed.professionalSummary);
      set('languages',           parsed.languages);
      set('designTools',         parsed.designTools);
      set('technicalSkills',     parsed.technicalSkills);
      set('softSkills',          parsed.softSkills);

      if (Array.isArray(parsed.experience) && parsed.experience.length > 0) {
        profileUpdate.experience = parsed.experience.map(e => ({
          role:     e.role     || '',
          company:  e.company  || '',
          location: e.location || '',
          duration: e.duration || '',
          summary:  e.summary  || '',
        }));
      }

      if (Array.isArray(parsed.education) && parsed.education.length > 0) {
        profileUpdate.education = parsed.education.map(e => ({
          degree:      e.degree      || '',
          institution: e.institution || '',
          duration:    e.duration    || '',
          gpa:         e.gpa         || '',
          coursework:  e.coursework  || '',
        }));
      }

      if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        profileUpdate.projects = parsed.projects.map(p => ({
          title:       p.title       || '',
          description: p.description || '',
          tags:        Array.isArray(p.tags) ? p.tags : [],
          githubLink:  p.githubLink  || '',
          liveLink:    p.liveLink    || '',
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
        ? 'Resume uploaded. Parsing failed — some fields may be missing.'
        : 'Resume uploaded and profile updated successfully.',
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
