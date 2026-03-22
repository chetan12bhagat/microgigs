import { fetchAuthSession } from "aws-amplify/auth";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityClient, GetIdCommand, GetCredentialsForIdentityCommand } from "@aws-sdk/client-cognito-identity";
import { awsConfig } from "./config";

const cognitoClient = new CognitoIdentityClient({ region: "us-east-1" });

const getCredentials = async (forceRefresh = false): Promise<any> => {
  try {
    const session = await fetchAuthSession({ forceRefresh });
    console.log("Amplify Session:", {
      hasTokens: !!session.tokens,
      hasCredentials: !!session.credentials,
      identityId: session.identityId
    });

    if (session.credentials) {
      return {
        accessKeyId: session.credentials.accessKeyId,
        secretAccessKey: session.credentials.secretAccessKey,
        sessionToken: session.credentials.sessionToken
      };
    }

    // Fallback: Manually get credentials from Identity Pool
    console.log("Attempting manual Cognito Identity fetch...");
    const identityPoolId = awsConfig.Auth.Cognito.identityPoolId;
    
    const idParams: any = { IdentityPoolId: identityPoolId };
    if (session.tokens?.idToken) {
      const loginKey = `cognito-idp.us-east-1.amazonaws.com/${awsConfig.Auth.Cognito.userPoolId}`;
      idParams.Logins = { [loginKey]: session.tokens.idToken.toString() };
    }

    const { IdentityId } = await cognitoClient.send(new GetIdCommand(idParams));
    const credParams: any = { IdentityId };
    if (idParams.Logins) {
      credParams.Logins = idParams.Logins;
    }

    const { Credentials } = await cognitoClient.send(new GetCredentialsForIdentityCommand(credParams));
    
    if (!Credentials) throw new Error("Field to get manual credentials");

    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretKey,
      sessionToken: Credentials.SessionToken
    };
  } catch (error) {
    console.error("Critical error in getCredentials:", error);
    throw error;
  }
};

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: () => getCredentials()
});

export const db = DynamoDBDocumentClient.from(client);

export const awsService = {
  db,
};
