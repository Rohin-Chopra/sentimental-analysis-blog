# Terraform

This is the terraform declaration for all the resources of the sentimental analysis application

## Getting Started

### Prerequisites

- Terraform CLI - Minimum version 1.4.x, you can download it from <https://developer.hashicorp.com/terraform/downloads>
- AWS account - If you don't have an account, you can get a free tier account at <https://aws.amazon.com/free/>.

### Installation

1. Initialize terraform

```bash
terraform init
```

### Configuration

Before deploying your terraform resources, you will need to setup your AWS credentials, it can be via a AWS CLI Profile or just environment variables such as:

```bash
export AWS_ACCESS_KEY_ID="your-aws-access-key"
export AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
```

### Deploying the infrastructure

To deploy the resources, run the following command:

```bash
terraform apply
```
