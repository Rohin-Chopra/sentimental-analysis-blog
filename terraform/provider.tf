terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.10"
    }
  }

  required_version = ">= 1.4.0"
}

provider "aws" {
  region = "ap-southeast-2"
}
