#!/bin/bash

source ~/.sun

set -e

cmd=$1

region=eu-west-1
node_image=node:18.17.1-alpine3.17
infra_image=meltwater/node-terraform-aws:argon-2023-08-23

print_title() {
  printf "\n\e[1;34m$1\n"
  printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\e[0m\n"
}

if [[ $cmd == "node" ]]; then

  print_title "Node dev console"

  docker run --rm -it \
    -e NODE_ENV=development \
    -v `pwd`:/app/ \
    -w /app/ \
      "$node_image" /bin/sh

elif [[ $cmd == "frontend" ]]; then

  print_title "Frontend"

  docker run --rm -it \
    -v `pwd`:/app/ \
    -p 8088:8088 \
    -w /app/project \
      $node_image /bin/sh -c "npm install && npm run start"

elif [[ $cmd =~ "deploy" ]]; then
  print_title "Running deploy"

  docker run --rm -t \
    -e BUCKET=$BUCKET \
    -e AWS_DEFAULT_REGION=$region \
    -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    -v `pwd`:/app/:cached \
    -w /app/ \
      "$infra_image" /bin/bash -c "./ops/deploy.sh"
else
  printf "\n\e[1;31m$1\nOps. '$cmd' is a invalid command. Try again :(\e[0m\n"
fi
