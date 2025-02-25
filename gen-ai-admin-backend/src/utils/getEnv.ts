import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Checks if a specific environment variable exists and returns its value if present.
 * @param {string} variableName - The name of the environment variable to check.
 * @returns {string | undefined} - The value of the environment variable or undefined if it does not exist.
 */
export const getEnvVariable = (variableName: string): string | undefined => {
    try {
        const value = process.env[variableName];
        if (!value) {
            console.warn(`⚠️ Environment variable "${variableName}" does not exist.`);
            return undefined; // Return undefined instead of a custom message
        }
        return value;
    } catch (error) {
        console.error(`⚠️ An error occurred while checking environment variable "${variableName}":`, error);
        return undefined; // Return undefined if there's an unexpected error
    }
};
