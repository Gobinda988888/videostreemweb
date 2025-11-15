const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');

async function testAdminLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = 'admin123'; // Default password

    // Check if admin already exists
    let admin = await User.findOne({ email: adminEmail });
    
    if (admin) {
      console.log(`✅ Admin user already exists: ${adminEmail}`);
      console.log(`   Is Admin: ${admin.isAdmin}`);
      console.log(`   Created At: ${admin.createdAt}`);
    } else {
      console.log(`Creating admin user: ${adminEmail}`);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Create admin user
      admin = new User({
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      
      await admin.save();
      console.log(`✅ Admin user created successfully!`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Is Admin: ${admin.isAdmin}`);
    }

    // Test password verification
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log(`\n🔐 Password verification test: ${isMatch ? '✅ PASSED' : '❌ FAILED'}`);

    // List all users
    const allUsers = await User.find({});
    console.log(`\n👥 Total users in database: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} ${user.isAdmin ? '(Admin)' : ''}`);
    });

    console.log('\n🎯 Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: admin123`);
    console.log(`   Login at: http://localhost:4000/login.html`);

    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAdminLogin();
