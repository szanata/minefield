#!/bin/bash

# docker run --rm -t \
#   -v `pwd`:/app/ \
#   -w /app/ \
#     node:11.6-alpine /bin/sh -c "cd frontend && npm install && npm run release"

docker run --rm -it \
  -e AWS_DEFAULT_REGION=us-east-1 \
  -e BUCKET_NAME=$MINEFIELD_BUCKET_NAME \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -v `pwd`:/app/ \
  -w /app/ \
    szanata/node-terraform-awscli:node12.14  /bin/sh -c "source ./ops/deploy.sh"
