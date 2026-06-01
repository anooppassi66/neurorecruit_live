const EXTERNAL_AUTH = 'https://recruit.neurocruit.ai/api/auth/validate-token';

const recruiterAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const response = await fetch(EXTERNAL_AUTH, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    if (!data.valid) {
      return res.status(401).json({ message: data.message || 'Invalid token' });
    }

    req.recruiter = data.user; // { id, name, email }
    next();
  } catch {
    res.status(503).json({ message: 'Authentication service unavailable' });
  }
};

module.exports = recruiterAuth;
