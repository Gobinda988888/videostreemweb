const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function setupAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${adminEmail}`);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();
    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   🔑 Please change the password after first login!`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

module.exports = setupAdminUser;
