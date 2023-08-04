import { KinesisClient, PutRecordsCommand } from "@aws-sdk/client-kinesis";
import { v4 as uuid } from "uuid";

const kinesisClient = new KinesisClient({ region: "ap-southeast-2" });

const reviews = [
  "these are some awesome shoes, a life save for me",
  "My feet are swollen just after a couple of hours of use, would not recommend to anyone",
]; // Very creative reviews

export async function handler() {
  await kinesisClient.send(
    new PutRecordsCommand({
      StreamName: process.env.KINESIS_STREAM_NAME,
      Records: reviews.map((review) => {
        return {
          Data: Buffer.from(JSON.stringify(review)),
          PartitionKey: uuid(),
        };
      }),
    })
  );
}
