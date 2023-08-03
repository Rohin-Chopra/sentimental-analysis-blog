import { KinesisClient, PutRecordsCommand } from "@aws-sdk/client-kinesis";
import { v4 as uuid } from "uuid";
import reviews from "./reviews.json";
const kinesisClient = new KinesisClient({ region: "ap-southeast-2" });

export async function handler(): Promise<void> {
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
