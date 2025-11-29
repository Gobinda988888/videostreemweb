const AWS = require('aws-sdk');
require('dotenv').config();

const r2 = new AWS.S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  signatureVersion: 'v4',
  s3ForcePathStyle: true,
});

async function configureCORS() {
  try {
    console.log('🔧 Configuring CORS for R2 bucket:', process.env.R2_BUCKET);
    
    const corsConfig = {
      Bucket: process.env.R2_BUCKET,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ['*'],
            AllowedMethods: ['GET', 'HEAD'],
            AllowedHeaders: ['*'],
            ExposeHeaders: [
              'Content-Length',
              'Content-Type',
              'Content-Range',
              'Accept-Ranges',
              'ETag'
            ],
            MaxAgeSeconds: 3600
          }
        ]
      }
    };
    
    await r2.putBucketCors(corsConfig).promise();
    console.log('✅ CORS configuration applied successfully!');
    
    // Verify CORS configuration
    const currentCors = await r2.getBucketCors({ Bucket: process.env.R2_BUCKET }).promise();
    console.log('\n📋 Current CORS configuration:');
    console.log(JSON.stringify(currentCors, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

configureCORS();
