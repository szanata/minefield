#!/bin/bash

echo 'Deploy static files to s3'

bucket=s3://$BUCKET_NAME
dist=./project/dist

# js
echo 'Uploading scripts...'
aws s3 rm $bucket --recursive --exclude '*' --include '*.js'
aws s3 cp $dist $bucket --recursive --exclude '*' --include '*.js' \
  --content-encoding 'gzip' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'text/javascript'

# css
echo 'Uploading styles...'
aws s3 rm $bucket --recursive --exclude '*' --include '*.css'
aws s3 cp $dist $bucket --recursive --exclude '*' --include '*.css' \
  --content-encoding 'gzip' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'text/css'

# html
echo 'Uploading htmls...'
aws s3 rm $bucket --recursive --exclude '*' --include '*.html'
aws s3 cp $dist $bucket --recursive --exclude '*' --include '*.html' \
  --content-encoding 'gzip' \
  --content-type 'text/html'

# jpg
echo 'Uploading jpegs...'
aws s3 rm $bucket --recursive --exclude '*' --include '*.jpg'
aws s3 cp $dist $bucket --recursive --exclude '*' --include '*.jpg' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'image/jpeg'

# png
echo 'Uploading pngs...'
aws s3 rm $bucket --recursive --exclude '*' --include '*.png'
aws s3 cp $dist $bucket --recursive --exclude '*' --include '*.png' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'image/png'

# wav
echo 'Uploading wavs...'
aws s3 rm $bucket --recursive --exclude '*' --include '*.wav'
aws s3 cp $dist $bucket --recursive --exclude '*' --include '*.wav' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'audio/wav'

# ico
echo 'Uploading icons...'
aws s3 rm $bucket --recursive --exclude '*' --include '*.ico'
aws s3 cp $dist $bucket --recursive --exclude '*' --include '*.ico' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'image/x-icon'

# txt
echo 'Uploading txts...'
aws s3 rm $bucket --recursive --exclude '*' --include '*.txt'
aws s3 cp $dist $bucket --recursive --exclude '*' --include '*.txt' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'text/plain'

echo 'Done!'
