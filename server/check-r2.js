const AWS = require('aws-sdk');
require('dotenv').config();

const r2 = new AWS.S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  signatureVersion: 'v4',
  s3ForcePathStyle: true,
});

async function listR2Files() {
  try {
    console.log('🔍 Checking R2 bucket:', process.env.R2_BUCKET);
    
    const params = {
      Bucket: process.env.R2_BUCKET,
      Prefix: 'videos/',
    };
    
    const data = await r2.listObjectsV2(params).promise();
    
    console.log('\n📹 Videos in R2 bucket:', data.Contents.length);
    console.log('\n--- File List ---\n');
    
    data.Contents.forEach((file, index) => {
      console.log(`${index + 1}. ${file.Key}`);
      console.log(`   Size: ${(file.Size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Last Modified: ${file.LastModified}`);
      console.log('');
    });
    
    // Try to get a signed URL for the specific video
    const videoKey = 'videos/1763511274599_2023-05-27-23-33-23(7).mp4';
    console.log('\n🔗 Testing signed URL for:', videoKey);
    
    const signedUrl = await new Promise((resolve, reject) => {
      r2.getSignedUrl('getObject', {
        Bucket: process.env.R2_BUCKET,
        Key: videoKey,
        Expires: 300, // 5 minutes
      }, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
    
    console.log('✅ Signed URL generated:', signedUrl);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listR2Files();
