import {
  BatchDetectSentimentCommand,
  BatchDetectSentimentItemResult,
  ComprehendClient,
} from "@aws-sdk/client-comprehend";
import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { KinesisStreamEvent } from "aws-lambda";
import { v4 as uuid } from "uuid";

const comprehendClient = new ComprehendClient({
  region: "ap-southeast-2",
});
const dynamoDbClient = new DynamoDBClient({ region: "ap-southeast-2" });

export async function handler(event: KinesisStreamEvent): Promise<void> {
  const records = event.Records.map((record) =>
    Buffer.from(record.kinesis.data, "base64").toString("utf-8")
  );

  const result = await comprehendClient.send(
    new BatchDetectSentimentCommand({
      TextList: records,
      LanguageCode: "en",
    })
  );

  if (!result.ResultList) {
    throw new Error("Result from comprehend could not be retrieved");
  }

  const sentimentalResults = result.ResultList.filter(
    (result) => typeof result.Index === "number" && result.Sentiment
  ).map((value) => {
    let result = value as Required<BatchDetectSentimentItemResult>;

    return {
      text: records[result.Index],
      sentiment: result.Sentiment,
      sentimentScore: result.SentimentScore,
    };
  });

  console.log("writing to dynamodb");
  await dynamoDbClient.send(
    new BatchWriteItemCommand({
      RequestItems: {
        "reviews-sentimental-table": sentimentalResults.map(
          (sentimentalResult) => {
            return {
              PutRequest: {
                Item: {
                  id: { S: uuid() },
                  text: { S: sentimentalResult.text },
                  sentiment: { S: sentimentalResult.sentiment },
                  sentimentScore: { N: (0.5).toString() },
                },
              },
            };
          }
        ),
      },
    })
  );
  console.log("written to dynamodb");
}
