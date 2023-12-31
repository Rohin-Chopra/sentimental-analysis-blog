resource "aws_kinesis_stream" "stream" {
  name             = "sentimental-analysis-stream"
  shard_count      = 1
  retention_period = 48

  stream_mode_details {
    stream_mode = "PROVISIONED"
  }
}

resource "aws_dynamodb_table" "reviews_table" {
  name         = "reviews-sentimental-table"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }
}

module "producer_lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "5.3.0"

  function_name = "sentimental-analysis-producer-lambda"
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  environment_variables = {
    "KINESIS_STREAM_NAME" = aws_kinesis_stream.stream.name
  }

  source_path = [
    "${path.module}/../packages/producer/.esbuild"
  ]

  attach_policy_statements = true
  policy_statements = {
    comprehend = {
      effect    = "Allow"
      actions   = ["kinesis:PutRecord", "kinesis:PutRecords"]
      resources = [aws_kinesis_stream.stream.arn]
    }
  }
}

module "consumer_lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "5.3.0"

  function_name = "sentimental-analysis-consumer-lambda"
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  source_path = [
    "${path.module}/../packages/consumer/.esbuild",
  ]


  environment_variables = {
    "DYNAMODB_TABLE_NAME" = aws_dynamodb_table.reviews_table.id
  }

  attach_policy_statements = true
  policy_statements = {
    kinesis = {
      effect = "Allow"
      actions = [
        "kinesis:DescribeStream",
        "kinesis:DescribeStreamSummary",
        "kinesis:GetRecords",
        "kinesis:GetShardIterator",
        "kinesis:ListShards",
        "kinesis:ListStreams",
        "kinesis:SubscribeToShard"
      ]
      resources = [aws_kinesis_stream.stream.arn]
    }
    comprehend = {
      effect    = "Allow"
      actions   = ["comprehend:BatchDetectSentiment"]
      resources = ["*"]
    }

    dynamodb = {
      effect    = "Allow"
      actions   = ["dynamodb:BatchWriteItem"]
      resources = [aws_dynamodb_table.reviews_table.arn]
    }
  }
}

resource "aws_lambda_event_source_mapping" "consumer_lambda_source_mapping" {
  event_source_arn  = aws_kinesis_stream.stream.arn
  function_name     = module.consumer_lambda_function.lambda_function_name
  starting_position = "LATEST"
}

