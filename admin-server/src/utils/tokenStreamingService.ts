import * as dotenv from 'dotenv';

dotenv.config();

interface TokenResponse {
  token_type: string;
  access_token: string;
}

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} not found`);
  }
  return value;
}

export async function getTokens(
  clientId: string,
  clientSecret: string,
  tokenUrl: string,
  maxRetries = 5,
  timeout = 10000 // 10 seconds
): Promise<{ authToken: string; profileToken: string }> {
  const data = new URLSearchParams({ grant_type: 'client_credentials' });
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authString}`,
        },
        body: data,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
          `Token request failed with status: ${response.status}. Response: ${responseBody}`
        );
      }

      const responseData: unknown = await response.json();

      if (isTokenResponse(responseData)) {
        const authToken = `${responseData.token_type} ${responseData.access_token}`;
        const profileToken = responseData.access_token.replace(/=*$/, ''); // Removes trailing '=' safely
        return { authToken, profileToken };
      }

      throw new Error('Invalid token response structure');
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          `Token request failed after ${maxRetries} attempts: ${(error as Error).message}`
        );
      }
      if ((error as Error).name === 'AbortError') {
        console.warn(`Attempt ${attempt}: Token request timed out`);
      } else {
        console.warn(`Attempt ${attempt}: ${error}`);
      }
    }
  }

  throw new Error('Failed to fetch tokens after maximum retries');
}

function isTokenResponse(data: any): data is TokenResponse {
  return (
    data &&
    typeof data.token_type === 'string' &&
    typeof data.access_token === 'string'
  );
}

async function envVariablesProcessor(): Promise<{
  authToken: string;
  url: string;
}> {
  const clientId = getEnvVariable('GEN_AI_LLM_CLIENT_ID');
  const clientSecret = getEnvVariable('GEN_AI_LLM_CLIENT_SECRET');
  const tokenUrl = getEnvVariable('COGNITO_TOKEN_URL');
  const { authToken } = await getTokens(clientId, clientSecret, tokenUrl);
  const url = getEnvVariable('STUDY_ASSISTANT_QUERY_PROCESSOR_URL');

  return { authToken, url };
}

function headerAndPayloadProcessor(
  profileToken: string,
  authToken: string,
  userQuery: string
) {
  const headers = {
    'Content-Type': 'application/json',
    'x-lacp-profile': profileToken,
    Authorization: authToken,
  };

  const data = {
    user_query: userQuery,
    enable_streaming: true,
  };

  return { headers, data };
}
