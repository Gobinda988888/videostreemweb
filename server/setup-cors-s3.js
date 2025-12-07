const AWS = require('aws-sdk');
require('dotenv').config();

// Configure S3 client for R2
const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  signatureVersion: 'v4',
  region: 'auto'
});

const corsConfig = {
  CORSRules: [
    {
      AllowedOrigins: ['*'],
      AllowedMethods: ['GET', 'HEAD', 'PUT', 'POST'],
      AllowedHeaders: ['*'],
      ExposeHeaders: ['Content-Length', 'Content-Type', 'Content-Range', 'Accept-Ranges', 'ETag', 'Last-Modified'],
      MaxAgeSeconds: 86400
    }
  ]
};

console.log('🔧 Setting up CORS for R2 bucket:', process.env.R2_BUCKET);
console.log('📋 CORS Config:', JSON.stringify(corsConfig, null, 2));

s3.putBucketCors({
  Bucket: process.env.R2_BUCKET,
  CORSConfiguration: corsConfig
}, (err, data) => {
  if (err) {
    console.error('❌ Error setting CORS:', err.message);
    console.error('Error details:', err);
  } else {
    console.log('✅ CORS configured successfully!');
    console.log('📋 Response:', data);
    
    // Verify CORS configuration
    s3.getBucketCors({
      Bucket: process.env.R2_BUCKET
    }, (err, data) => {
      if (err) {
        console.error('❌ Error reading CORS:', err.message);
      } else {
        console.log('\n✅ Current CORS Configuration:');
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }
});
