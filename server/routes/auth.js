const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');
const PasswordReset = require('../models/PasswordReset');
const PendingRegistration = require('../models/PendingRegistration');
const auth = require('../middleware/auth');
const { sendOtpEmail, sendRegistrationOtpEmail } = require('../utils/mailer');

const router = express.Router();

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

// Register — step 1: stage the signup and email a 6-digit verification code
router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = String(req.body.email || '').toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);

    // One live signup per email — a new request invalidates the previous one
    await PendingRegistration.findOneAndUpdate(
      { email },
      { name, email, passwordHash, otpHash, attempts: 0, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
      { upsert: true, new: true }
    );

    await sendRegistrationOtpEmail(email, otp);

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register — step 2: verify the code, create the user, and log them in
router.post('/register/verify-otp', async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const { otp } = req.body;

    const record = await PendingRegistration.findOne({ email });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Verification code expired. Please register again' });
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await PendingRegistration.deleteOne({ _id: record._id });
      return res.status(429).json({ message: 'Too many attempts. Please register again' });
    }

    const isMatch = await bcrypt.compare(String(otp || ''), record.otpHash);
    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Someone else may have registered this email while the code was pending
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await PendingRegistration.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert directly with the already-hashed password — the User model's
    // pre-save hook would otherwise hash it a second time on a new document.
    const inserted = await User.collection.insertOne({
      name: record.name,
      email: record.email,
      password: record.passwordHash,
      availability: 1,
      createdAt: new Date()
    });
    const savedUser = await User.findById(inserted.insertedId);

    const profile = new Profile({ user: savedUser._id, fullName: savedUser.name, email: savedUser.email });
    await profile.save();

    await PendingRegistration.deleteOne({ _id: record._id });

    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Email verified successfully',
      token,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, availability: savedUser.availability }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, availability: user.availability }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        availability: user.availability
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update availability
router.put('/availability', auth, async (req, res) => {
  try {
    const { availability } = req.body;
    
    // ensure availability is a number (0 or 1)
    const validAvailability = availability === 1 ? 1 : 0;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { availability: validAvailability },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Availability updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        availability: user.availability
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot password — step 1: email the user a 6-digit OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);

    // One live OTP per email — a new request invalidates the previous one
    await PasswordReset.findOneAndUpdate(
      { email },
      { email, otpHash, attempts: 0, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Could not send OTP', error: error.message });
  }
});

// Forgot password — step 2: verify the OTP, hand back a short-lived reset token
router.post('/verify-otp', async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const { otp } = req.body;

    const record = await PasswordReset.findOne({ email });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one' });
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await PasswordReset.deleteOne({ _id: record._id });
      return res.status(429).json({ message: 'Too many attempts. Please request a new OTP' });
    }

    const isMatch = await bcrypt.compare(String(otp || ''), record.otpHash);
    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const resetToken = jwt.sign(
      { email, purpose: 'password_reset' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '10m' }
    );

    res.json({ message: 'OTP verified', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot password — step 3: set the new password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return res.status(400).json({ message: 'Reset session expired. Please start again' });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    // The OTP record must still exist — it is consumed on success
    const record = await PasswordReset.findOne({ email: decoded.email });
    if (!record) {
      return res.status(400).json({ message: 'Reset session expired. Please start again' });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();
    await PasswordReset.deleteOne({ _id: record._id });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;