import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import { awsConfig } from "./config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

Amplify.configure(awsConfig);

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: async () => {
    const session = await fetchAuthSession();
    if (!session.credentials) {
      throw new Error("No AWS credentials found in session");
    }
    return {
      accessKeyId: session.credentials.accessKeyId,
      secretAccessKey: session.credentials.secretAccessKey,
      sessionToken: session.credentials.sessionToken
    };
  }
});

export const db = DynamoDBDocumentClient.from(client);

export const awsService = {
  db,
};
