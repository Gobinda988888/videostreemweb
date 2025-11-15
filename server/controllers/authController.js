const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    // Default admin email if ADMIN_EMAIL is not set in .env
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const isAdmin = adminEmail === email;

    const user = new User({ email, password: hashed, isAdmin });
    await user.save();

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key_12345';
    const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login attempt failed: User not found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials. Please register first.' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log(`Login attempt failed: Wrong password for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials. Wrong password.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key_12345';
    const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ Password reset for user: ${email}`);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, forgotPassword };
