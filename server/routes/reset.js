const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Emergency password reset endpoint (REMOVE IN PRODUCTION!)
router.post('/reset-admin-password', async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const newPassword = req.body.password || 'admin123';
    
    console.log(`🔧 Resetting password for: ${adminEmail}`);
    
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      // Create admin if doesn't exist
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const newAdmin = new User({
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      await newAdmin.save();
      console.log(`✅ Admin user created with password: ${newPassword}`);
      return res.json({ message: 'Admin user created successfully', email: adminEmail });
    }
    
    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    
    console.log(`✅ Password reset successfully for: ${adminEmail}`);
    res.json({ 
      message: 'Password reset successfully', 
      email: adminEmail,
      password: newPassword 
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
