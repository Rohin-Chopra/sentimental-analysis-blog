# Sentimental analysis

## Overview

This is the code for my blog on [medium](https://medium.com/p/72a1c8bd9e5f/edit)

## Project structure

- `packages`: Contains the lambda functions
  - `producer`: Producer lambda that publishes records to the AWS Kinesis stream
  - `consumer`: Consumer lambda that reads records from the stream to do analysis
- `terraform`: Contains the Terraform configuration for this project

## Getting started

Each folder has it's own getting starting guide, I would recommend doing all these in the following order:

1. [Consumer lambda](./packages/consumer/README.md#getting-started)
2. [Producer lambda](./packages/producer/README.md#getting-started)
3. [Terraform](./terraform/README.md#getting-started)
