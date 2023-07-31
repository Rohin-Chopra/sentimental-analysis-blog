import {
  BatchDetectSentimentCommand,
  BatchDetectSentimentItemResult,
  ComprehendClient,
  SentimentType,
} from "@aws-sdk/client-comprehend";
import { KinesisStreamEvent } from "aws-lambda";

const comprehendClient = new ComprehendClient({
  region: "ap-southeast-2",
});

type SentimentalResult = {
  input: string;
  result: SentimentType | string;
};

export async function handler(
  event: KinesisStreamEvent
): Promise<SentimentalResult[]> {
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

  const sentimentalResult = result.ResultList.filter(
    (result) => typeof result.Index === "number" && result.Sentiment
  ).map((value) => {
    let result = value as Required<BatchDetectSentimentItemResult>;

    return {
      input: records[result.Index],
      result: result.Sentiment,
    };
  });

  console.log("Results from AWS comprehend");
  console.log(sentimentalResult);

  return sentimentalResult;
}
