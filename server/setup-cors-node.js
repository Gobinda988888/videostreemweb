const https = require('https');

const accountId = 'e526688de8d8a36339e56f7b461e74b7';
const bucketName = 'videov3';
const apiToken = 'OP5k8bHmRgfpTghhUD88YBObf5H8pw-abVU3CQes';

const corsConfig = JSON.stringify({
  cors_rules: [
    {
      allowed_origins: ['*'],
      allowed_methods: ['GET', 'HEAD'],
      allowed_headers: ['*'],
      expose_headers: ['Content-Length', 'Content-Type', 'Content-Range', 'Accept-Ranges', 'ETag'],
      max_age_seconds: 3600
    }
  ]
});

const options = {
  hostname: 'api.cloudflare.com',
  port: 443,
  path: `/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/cors`,
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(corsConfig)
  }
};

console.log('🔧 Configuring CORS for R2 bucket:', bucketName);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n📋 Response Status:', res.statusCode);
    console.log('📋 Response:', data);
    
    if (res.statusCode === 200 || res.statusCode === 204) {
      console.log('\n✅ CORS configured successfully!');
      console.log('🎉 Videos should now play without issues!');
    } else {
      console.log('\n❌ Failed to configure CORS');
      console.log('Manual configuration required in Cloudflare Dashboard');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(corsConfig);
req.end();
