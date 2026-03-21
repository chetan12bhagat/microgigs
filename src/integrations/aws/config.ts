export const awsConfig: any = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_ApCc9P9KN",
      userPoolClientId: "3nl4ruisnv2m95bt0m9g7l65j7",
      loginWith: {
        oauth: {
          domain: "microgig-hub.auth.us-east-1.amazoncognito.com",
          scopes: ["email", "openid", "profile"],
          redirectSignIn: ["http://localhost:8080/"],
          redirectSignOut: ["http://localhost:8080/"],
          responseType: "code"
        }
      }
    }
  }
};

export const DYNAMODB_TABLE_NAME = "microgig";
