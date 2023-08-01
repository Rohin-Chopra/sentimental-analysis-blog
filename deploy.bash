#!/bin/bash

cd packages/consumer
npm run build

cd ../producer
npm run build

cd ../../terraform
terraform apply -auto-approve
