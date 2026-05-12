const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');

const recruiterAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!decoded.recruiterId) return res.status(401).json({ message: 'Invalid token' });

    const recruiter = await Recruiter.findById(decoded.recruiterId);
    if (!recruiter) return res.status(401).json({ message: 'Recruiter not found' });

    req.recruiter = recruiter;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = recruiterAuth;
