#!/usr/bin/env bash

# Cloudflare R2 CORS Configuration using API
# This will add CORS policy to allow video playback in browsers

ACCOUNT_ID="e526688de8d8a36339e56f7b461e74b7"
BUCKET_NAME="videov3"
API_TOKEN="9yfXCHXOuVn_nimTQu6-WuOyH9Zoyst6Grqz7rlm"

echo "🔧 Configuring CORS for R2 bucket: $BUCKET_NAME"

curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/$BUCKET_NAME/cors" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cors_rules": [
      {
        "allowed_origins": ["*"],
        "allowed_methods": ["GET", "HEAD"],
        "allowed_headers": ["*"],
        "expose_headers": ["Content-Length", "Content-Type", "Content-Range", "Accept-Ranges", "ETag"],
        "max_age_seconds": 3600
      }
    ]
  }'

echo ""
echo "✅ CORS configuration applied!"
