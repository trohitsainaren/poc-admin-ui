import { getEnvVariable } from "./getEnv.js";

/**
 * Validates that all required environment variables are set.
 * @param {string[]} requiredVars - Array of environment variable names to check.
 * @returns {{ isValid: boolean; missingVars: string[] }} - Returns validation status and list of missing variables.
 */
export const validateEnvVariables = (requiredVars: string[]): { 
    isValid: boolean; 
    missingVars: string[] 
} => {
    const missingVars: string[] = [];

    requiredVars.forEach((variableName) => {
        const value = getEnvVariable(variableName);
        if (!value) {
            missingVars.push(variableName);
        }
    });

    return {
        isValid: missingVars.length === 0,
        missingVars
    };
};