const express = require('express');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

const router = express.Router();

const PAGE_SIZE = 10;

// Search jobs by keyword — searches title + description
// GET /api/jobs/search?q=frontend&page=1
router.get('/search', async (req, res) => {
  try {
    const { q = '', page = 1 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const skip = (pageNum - 1) * PAGE_SIZE;

    let query = {};
    if (q.trim()) {
      query = { $text: { $search: q.trim() } };
    }

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE).lean(),
      Job.countDocuments(query)
    ]);

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single job detail
// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Match jobs to candidate's skills (requires auth)
// GET /api/jobs/match/me?page=1
router.get('/match/me', auth, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const skip = (pageNum - 1) * PAGE_SIZE;

    const profile = await Profile.findOne({ user: req.user._id }).lean();
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const candidateSkills = [
      ...(profile.technicalSkills || []),
      ...(profile.designTools || []),
      ...(profile.softSkills || [])
    ].filter(Boolean);

    if (!candidateSkills.length) {
      return res.json({ jobs: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 }, message: 'Add skills to your profile to see matches.' });
    }

    // Case-insensitive skill match — at least one skill overlaps
    const regexes = candidateSkills.map(s => new RegExp(`^${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
    const matchQuery = { skills: { $elemMatch: { $in: regexes } } };

    const [allMatches, total] = await Promise.all([
      Job.find(matchQuery).lean(),
      Job.countDocuments(matchQuery)
    ]);

    // Score by how many candidate skills each job requires
    const scored = allMatches.map(job => {
      const jobSkillsLower = (job.skills || []).map(s => s.toLowerCase());
      const matchCount = candidateSkills.filter(cs => jobSkillsLower.includes(cs.toLowerCase())).length;
      return { ...job, matchCount };
    });

    scored.sort((a, b) => b.matchCount - a.matchCount);
    const paginated = scored.slice(skip, skip + PAGE_SIZE);

    res.json({
      jobs: paginated,
      pagination: { page: pageNum, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
