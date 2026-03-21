export const awsConfig: any = {
  Auth: {
    Cognito: {
      identityPoolId: "us-east-1:6cd0a66a-ded7-443c-9316-d98e676fbd75",
      userPoolId: "us-east-1_ApCc9P9KN",
      userPoolClientId: "3nl4ruisnv2m95bt0m9g7l65j7",
      loginWith: {
        oauth: {
          domain: "microgig-hub.auth.us-east-1.amazoncognito.com",
          scopes: ["email", "openid", "profile"],
          redirectSignIn: ["http://localhost:8080/", "https://microgigs.vercel.app/"],
          redirectSignOut: ["http://localhost:8080/", "https://microgigs.vercel.app/"],
          responseType: "code"
        }
      }
    }
  }
};

export const DYNAMODB_TABLE_NAME = "microgig";
