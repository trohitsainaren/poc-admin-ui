import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import logger from './logger';


dotenv.config(); // Ensure environment variables are loaded

// Resolve to the root directory of the project
const rootDir = path.resolve('/');
// Resolve the secret file path using the root directory
const secretFilePath = path.resolve(rootDir, process.env.SECRET_PATH || '');

// Cache for storing secrets
let cachedSecrets: Record<string, any> = {};

// Function to read and parse the secret file
export const getSecretValue = async (): Promise<Record<string, any>> => {
  try {
    // Read the contents of the secret file
    const secretData = await fs.promises.readFile(secretFilePath, 'utf8');
    const secrets = JSON.parse(secretData);
    cachedSecrets = secrets;
    return secrets;
  } catch (error) {
    logger.error('Error reading the secret file:', error);
    return cachedSecrets;
  }
};

// Function to watch the secret file for changes
const watchSecretFile = () => {
  fs.watch(secretFilePath, async (eventType) => {
    if (eventType === 'change') {
      logger.info('Secret file updated. Reloading...');
      try {
        await getSecretValue();
      } catch (error) {
        logger.error('Error updating secrets:', error);
      }
    }
  });
};

// Initial load of secrets
getSecretValue()
  .then(() => {
    // Start watching the file for changes
    watchSecretFile();
  })
  .catch((error) => {
    logger.error('Initial secret load failed:', error);
  });
