import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SentimentalPieChart } from "./components/Chart";
import { groupBy } from "./utils";

type Review = {
  id: string;
  text: string;
  sentiment: string;
  sentimentScore: number;
};

const client = new DynamoDBClient({ region: "ap-southeast-2" });

export default async function Home() {
  const response = await client.send(
    new ScanCommand({
      TableName: "reviews-sentimental-table",
    })
  );

  const reviews = response.Items?.map((item) => {
    return {
      id: item["id"].S,
      text: item["text"].S,
      sentiment: item["sentiment"].S,
      sentimentScore: +item["sentimentScore"].N!,
    };
  }) as Required<Review[]>;

  const groupedSentiments = groupBy(reviews, "sentiment");
  const sentimentCounts: { name: string; value: number }[] = Object.keys(
    groupedSentiments
  ).map((sentimentKey) => {
    return {
      name: sentimentKey,
      value: groupedSentiments[sentimentKey].length,
    };
  });

  return (
    <div className="min-h-screen bg-black dark:text-white">
      <div className="container px-4 py-8">
        <h1 className="text-4xl font-bold">Sentiment Analysis Dashboard</h1>
        <SentimentalPieChart reviews={sentimentCounts} />

        <h2 className="text-2xl mb-4">Reviews</h2>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Review
              </th>
              <th scope="col" className="px-6 py-3">
                Sentiment
              </th>
              <th scope="col" className="px-6 py-3">
                Sentiment Score
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews?.map((review) => (
              <tr
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                key={review.id}
              >
                <td className="px-6 py-4">{review.text}</td>
                <td className="px-6 py-4">{review.sentiment}</td>
                <td className="px-6 py-4">{review.sentimentScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
