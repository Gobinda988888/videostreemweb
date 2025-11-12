const AWS = require('aws-sdk');

// Lazy initialization - only create R2 client when actually needed and configured
let r2Client = null;

const getR2Client = () => {
  if (!r2Client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKey = process.env.R2_ACCESS_KEY;
    const secretKey = process.env.R2_SECRET_KEY;
    const endpointEnv = process.env.R2_ENDPOINT && process.env.R2_ENDPOINT.trim();

    // Basic validation: access key and secret must be provided
    if (!accessKey || !secretKey || accessKey.includes('your_') || secretKey.includes('your_')) {
      throw new Error('R2 is not configured (missing access key or secret).');
    }

    // Prefer explicit endpoint if provided; otherwise construct from accountId
    const endpoint = endpointEnv && endpointEnv.length
      ? endpointEnv.replace(/\/+$/,'')
      : (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);

    if (!endpoint) {
      throw new Error('R2 endpoint (R2_ENDPOINT) or R2_ACCOUNT_ID must be configured.');
    }

    r2Client = new AWS.S3({
      endpoint,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
    });
  }
  return r2Client;
};

const getSignedUrl = (key, expiresSeconds = 60 * 60) => {
  const r2 = getR2Client();
  const params = {
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Expires: expiresSeconds,
  };
  return new Promise((resolve, reject) => {
    r2.getSignedUrl('getObject', params, (err, url) => {
      if (err) return reject(err);
      resolve(url);
    });
  });
};

const uploadStream = (key, buffer, contentType) => {
  const r2 = getR2Client();
  const params = {
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'private',
  };
  return r2.upload(params).promise();
};

const deleteObject = (key) => {
  const r2 = getR2Client();
  const params = { Bucket: process.env.R2_BUCKET, Key: key };
  return r2.deleteObject(params).promise();
};

module.exports = { getSignedUrl, uploadStream, deleteObject };
