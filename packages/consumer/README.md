# consumer lambda

## Overview

The consumer lambda is responsible for performing sentimental analyzing on incoming data from the stream and then save the results to DynamoDB for further analysis.

### Getting started

To get started with the consumer lambda, follow these steps:

1. Change to the consumer directory

```bash
cd packages/consumer
```

2. Install dependencies

```bash
npm install
```

### Deployment

From the root directory, you can run the following command to deploy it to AWS:

```bash
bash deploy.sh
```
