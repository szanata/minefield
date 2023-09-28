#!/bin/bash

set -e

cd "${0%/*}"

target=s3://$BUCKET/minefield
dist="../project/dist"

echo -e "────────────────────────────────────────────────────────\n"
echo -e "\e[46;30;1m[Deploy]\e[0m\e[0m"

echo -e "\e[46;30m[1/7]\e[0m Building\e[0m"
(cd $dist && npm i --silent)
(cd $dist && npm run dist)

echo -e "\e[46;30m[2/7]\e[0m Cleaning up remote\e[0m"
aws s3 rm $target --recursive --include '*'

echo -e "\e[46;30m[3/7]\e[0m Uploading scripts\e[0m"
aws s3 rm $target --recursive --exclude '*' --include '*.js'
aws s3 cp $dist $target --recursive --exclude '*' --include '*.js' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'text/javascript'

echo -e "\e[46;30m[4/7]\e[0m Uploading styles\e[0m"
aws s3 rm $target --recursive --exclude '*' --include '*.css'
aws s3 cp $dist $target --recursive --exclude '*' --include '*.css' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'text/css'

echo -e "\e[46;30m[5/7]\e[0m Uploading markups\e[0m"
aws s3 rm $target --recursive --exclude '*' --include '*.html'
aws s3 cp $dist $target --recursive --exclude '*' --include '*.html' \
  --content-type 'text/html'

echo -e "\e[46;30m[6/7]\e[0m Uploading sounds\e[0m"
aws s3 rm $target --recursive --exclude '*' --include '*.wav'
aws s3 cp $dist $target --recursive --exclude '*' --include '*.wav' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'audio/wav'

echo -e "\e[46;30m[7/7]\e[0m Uploading icons\e[0m"
aws s3 rm $target --recursive --exclude '*' --include '*.ico'
aws s3 cp $dist $target --recursive --exclude '*' --include '*.ico' \
  --cache-control 'public, max-age=31536000' \
  --content-type 'image/x-icon'

echo -e "────────────────────────────────────────────────────────\n"
