const AWS = require('aws-sdk');
require('dotenv').config();

const r2 = new AWS.S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  signatureVersion: 'v4',
  s3ForcePathStyle: true,
});

async function checkBucket() {
  try {
    console.log('🔍 Checking R2 bucket configuration...\n');
    
    // Check bucket location
    const location = await r2.getBucketLocation({ Bucket: process.env.R2_BUCKET }).promise();
    console.log('📍 Bucket Location:', location.LocationConstraint || 'default');
    
    // Try to get CORS configuration
    try {
      const cors = await r2.getBucketCors({ Bucket: process.env.R2_BUCKET }).promise();
      console.log('\n✅ CORS Configuration exists:');
      console.log(JSON.stringify(cors, null, 2));
    } catch (err) {
      if (err.code === 'NoSuchCORSConfiguration') {
        console.log('\n⚠️  No CORS configuration found - This is why videos are not playing!');
      } else {
        console.log('\n❌ CORS check error:', err.message);
      }
    }
    
    // Test video access
    const videoKey = 'videos/1763511274599_2023-05-27-23-33-23(7).mp4';
    console.log('\n🔗 Generating signed URL for:', videoKey);
    
    const signedUrl = await new Promise((resolve, reject) => {
      r2.getSignedUrl('getObject', {
        Bucket: process.env.R2_BUCKET,
        Key: videoKey,
        Expires: 7200, // 2 hours
      }, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
    
    console.log('✅ Signed URL:', signedUrl);
    
    console.log('\n💡 SOLUTION:');
    console.log('Go to Cloudflare Dashboard → R2 → videov3 bucket → Settings');
    console.log('Add a public domain or configure CORS policy to allow video playback');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkBucket();
