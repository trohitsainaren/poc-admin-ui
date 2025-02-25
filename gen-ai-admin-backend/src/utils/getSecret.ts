import fs from 'fs';
import path from 'path';
import { getEnvVariable } from './getEnv.js';

type SecretsCache = { [key: string]: string };

let secretsCache: SecretsCache | null = null;

/**
 * Loads secrets from the credentials file into memory
 * @returns {SecretsCache} Object containing the secrets
 */
const loadSecrets = (): SecretsCache => {
    if (secretsCache !== null) {
        return secretsCache;
    }

    try {
        const secretPath = getEnvVariable('SECRET_PATH');
        if (!secretPath) {
            console.error('SECRET_PATH environment variable is not set');
            return {};
        }

        const fullPath = path.resolve(secretPath);
        if (!fs.existsSync(fullPath)) {
            console.error(`Secrets file does not exist at: ${fullPath}`);
            return {};
        }

        const fileContent = fs.readFileSync(fullPath, 'utf8');
        if (!fileContent.trim()) {
            console.warn('Secrets file is empty');
            return {};
        }

        let parsedSecrets: SecretsCache = {};

        try {
            // Try to parse as JSON
            parsedSecrets = JSON.parse(fileContent);
        } catch {
            // If not JSON, try to parse as key=value format
            parsedSecrets = fileContent
                .split('\n')
                .reduce((acc: SecretsCache, line) => {
                    const [key, ...values] = line.split('=');
                    const trimmedKey = key.trim();
                    if (trimmedKey && !trimmedKey.startsWith('#')) {
                        acc[trimmedKey] = values.join('=').trim();
                    }
                    return acc;
                }, {});
        }

        secretsCache = parsedSecrets;
        return parsedSecrets;
    } catch (error) {
        console.error('Error loading secrets:', error);
        return {};
    }
};

/**
 * Gets a specific secret value from the credentials file
 * @param {string} secretName - The name of the secret to retrieve
 * @returns {string | undefined} - The secret value or undefined if it doesn't exist
 */
export const getSecret = (secretName: string): string | undefined => {
    try {
        const secrets = loadSecrets();
        const value = secrets[secretName];
        
        if (!value) {
            console.warn(`Secret "${secretName}" does not exist.`);
            return undefined;
        }
        
        return value;
    } catch (error) {
        console.error(`Error retrieving secret "${secretName}":`, error);
        return undefined;
    }
};

/**
 * Reloads the secrets cache
 */
export const reloadSecrets = (): void => {
    secretsCache = null;
};