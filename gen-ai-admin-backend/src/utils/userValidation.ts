import { CognitoIdentityProviderClient, AdminListGroupsForUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import logger from "./logger.js";

const AWS_REGION = process.env.AWS_REGION;
const ROLE_ARN = process.env.COGNITO_CROSS_ACCOUNT_ROLE_ARN; // Cross-account role ARN

async function getCredentials(): Promise<AwsCredentialIdentity | undefined> {
  if (!ROLE_ARN) {
    logger.warn("[Middleware: UserValidation]: ROLE_ARN is not provided. Skipping role assumption.");
    const credentials = await fromNodeProviderChain()();
    return credentials;
  }

  const stsClient = new STSClient({ region: AWS_REGION });
  const command = new AssumeRoleCommand({
    RoleArn: ROLE_ARN,
    RoleSessionName: "EKSServiceSession",
  });

  try {
    const response = await stsClient.send(command);
    return {
      accessKeyId: response.Credentials?.AccessKeyId ?? "", // Ensure accessKeyId is always defined as a string
      secretAccessKey: response.Credentials?.SecretAccessKey ?? "", // Ensure secretAccessKey is always defined as a string
      sessionToken: response.Credentials?.SessionToken ?? "", // Ensure sessionToken is always defined as a string
    };
  } catch (error) {
    logger.error("[Middleware: UserValidation]: Error assuming role:", error);
    throw error;
  }
}

export default async function isUserInGroup(username: string): Promise<boolean> {
  const groupName = process.env.GROUP_NAME;
  const userPoolId = process.env.USER_POOL_ID;

  if (!groupName || !userPoolId) {
    throw new Error("[Middleware: UserValidation]: GROUP_NAME or USER_POOL_ID environment variables are not set.");
  }

  logger.warn(`[Middleware: UserValidation]: Checking if user "${username}" is in group "${groupName}".`);

  try {
    const credentials = await getCredentials();

    // Ensure credentials are properly assigned as AwsCredentialIdentity
    const awsCredentials: AwsCredentialIdentity | undefined = credentials
      ? {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
        }
      : undefined;

    const client = new CognitoIdentityProviderClient({
      region: AWS_REGION,
      credentials: awsCredentials, // Pass actual credentials object here
    });

    const command = new AdminListGroupsForUserCommand({
      Username: username,
      UserPoolId: userPoolId,
    });

    const response = await client.send(command);
    const isInGroup = response.Groups?.some((group) => group.GroupName === groupName) ?? false;

    logger.warn(`[Middleware: UserValidation]: User "${username}" ${isInGroup ? "is" : "is not"} in group "${groupName}".`);

    return isInGroup;
  } catch (error) {
    logger.error("[Middleware: UserValidation]: Error checking group membership:", error);
    throw error;
  }
}
