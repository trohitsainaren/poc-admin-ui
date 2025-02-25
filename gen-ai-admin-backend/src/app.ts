import express from "express";
import { getEnvVariable } from './utils/getEnv.js';
import { validateSecretsPath } from "./utils/validateSecrets.js";
import { validateEnvVariables } from "./utils/validateEnv.js";
import { getSecret } from "./utils/getSecret.js";
import routes from './routes/index.js';
import cors from 'cors';

const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'SECRET_PATH',
    // Add other required variables here
];

const { isValid, missingVars } = validateEnvVariables(requiredEnvVars);

if (!isValid) {
    console.error('Missing required environment variables:');
    missingVars.forEach(variable => {
        console.error(`   - ${variable}`);
    });
    process.exit(1);
}

console.log('All required environment variables are set');

// First, validate the SECRET_PATH environment variable
const isSecretsValid = validateSecretsPath("SECRET_PATH");
if (!isSecretsValid) {
    console.error("Failed to validate secrets. Exiting...");
    process.exit(1);
}

// getSecret
const clientSecret = getSecret("GEN_AI_LLM_CLIENT_SECRET");
if (!clientSecret) {
    console.error(" Failed to retrieve client secret. Exiting...");
    process.exit(1);
}
else {
    console.log("Client secret retrieved successfully.");
    console.log("Client secret:", clientSecret);
}

const corsOptions = {
    origin: '*',
};
const beta = '/beta';
const app = express();
const PORT = getEnvVariable("PORT") || 3000;
app.use(express.json());
app.use(cors(corsOptions));
app.use(beta + '/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;