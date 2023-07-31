import { KinesisClient, PutRecordsCommand } from "@aws-sdk/client-kinesis";
import { v4 as uuid } from "uuid";

const kinesisClient = new KinesisClient({ region: "ap-southeast-2" });

export async function handler() {
  const records = ["A very bad product", "a great product"];

  return await kinesisClient.send(
    new PutRecordsCommand({
      StreamName: process.env.KINESIS_STREAM_NAME,
      Records: records.map((record) => {
        return {
          Data: Buffer.from(JSON.stringify(record)),
          PartitionKey: uuid(),
        };
      }),
    })
  );
}
