require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function debugAdmin() {
  try {
    console.log('\n🔍 ADMIN DEBUG REPORT\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check environment variables
    console.log('\n1️⃣ Environment Variables:');
    console.log(`   ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || '❌ NOT SET'}`);
    console.log(`   ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET'}`);
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET'}`);
    
    // Connect to MongoDB
    console.log('\n2️⃣ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ Connected successfully!');
    
    // Check all users
    console.log('\n3️⃣ Database Users:');
    const allUsers = await User.find({});
    console.log(`   Total users: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('   ⚠️ No users in database!');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      - Is Admin: ${user.isAdmin}`);
        console.log(`      - Created: ${user.createdAt}`);
      });
    }
    
    // Check admin user specifically
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    console.log(`\n4️⃣ Checking Admin User: ${adminEmail}`);
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('   ❌ Admin user NOT FOUND in database!');
      console.log('   📝 Creating admin user now...');
      
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      await newAdmin.save();
      console.log('   ✅ Admin user created!');
    } else {
      console.log('   ✅ Admin user EXISTS in database');
      console.log(`      - Email: ${admin.email}`);
      console.log(`      - Is Admin: ${admin.isAdmin}`);
      console.log(`      - Has Password: ${admin.password ? 'Yes' : 'No'}`);
      
      // Test password
      console.log('\n5️⃣ Testing Password:');
      const testPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const isMatch = await bcrypt.compare(testPassword, admin.password);
      console.log(`   Password "${testPassword}": ${isMatch ? '✅ CORRECT' : '❌ WRONG'}`);
      
      if (!isMatch) {
        console.log('\n   🔧 FIXING PASSWORD...');
        admin.password = await bcrypt.hash(testPassword, 10);
        await admin.save();
        console.log('   ✅ Password updated successfully!');
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 SUMMARY:');
    console.log(`   Admin Email: ${adminEmail}`);
    console.log(`   Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`   Login URL: http://localhost:4000/login.html`);
    console.log(`   OR: https://videostreemweb.onrender.com/login.html`);
    console.log('\n✅ Debug completed!\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

debugAdmin();
