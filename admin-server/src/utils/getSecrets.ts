// utils/secrets.ts
import logger from './logger';
import { getSecretValue } from './secrets';

 // Add a types file to define the Secrets type
export interface Secrets {
    SECOPS_CLIENT_SECRET: string;
    SECOPS_PASSWORD: string;
    GEN_AI_LLM_CLIENT_SECRET: string;
    DATA_INSIGHTS_CLIENT_SECRET: string;
  }
let cachedSecrets: Secrets | null = null;

export const initializeSecrets = async () => {
  if (cachedSecrets) {
    logger.info('Secrets already loaded.');
    return cachedSecrets;  // Return cached secrets if already loaded
  }

  try {
    const secrets = await getSecretValue();
    cachedSecrets = {
      SECOPS_CLIENT_SECRET: secrets.SECOPS_CLIENT_SECRET,
      SECOPS_PASSWORD: secrets.SECOPS_PASSWORD,
      GEN_AI_LLM_CLIENT_SECRET: secrets.GEN_AI_LLM_CLIENT_SECRET,
      DATA_INSIGHTS_CLIENT_SECRET: secrets.DATA_INSIGHTS_CLIENT_SECRET
    };
    logger.info('Secrets loaded successfully');
    return cachedSecrets;
  } catch (error) {
    logger.error('Error loading secrets:', error);
   
    throw new Error('Failed to initialize secrets');
  }
};

export const getSecrets = (): Secrets | null => {
  if (!cachedSecrets) {
    logger.error('Secrets are not initialized');
    return null;
  }
  return cachedSecrets;
};
