import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GetProfileTokenFromRequest, GetSecureTokenFromRequest } from './utils/tokenUtils';
import { getTokens } from './utils/tokenStreamingService';
import { getSecrets, initializeSecrets } from './utils/getSecrets';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Middleware to get tokens from request
const getTokensFromRequest = (req: Request) => {
    const profileToken = req.headers['x-lacp-profile'] as string;
    const secureToken = req.headers['x-lacp-secure'] as string;
    return { profileToken, secureToken };
};

// Router for seed questions
const seedQuestionsRouter = express.Router();

seedQuestionsRouter.post('/', async (req: any, res: any) => {
    try {
        await initializeSecrets();
     
        const secrets = getSecrets();
    
        if (!secrets) {
          const errorMessage = 'Failed to fetch secrets.';
          logger.error(errorMessage);
          throw new Error(errorMessage);
        }
    
        const clientId = process.env.GEN_AI_LLM_CLIENT_ID;
        const cogntioUrl = process.env.COGNITO_TOKEN_URL;
        const clientSecret = secrets['GEN_AI_LLM_CLIENT_SECRET'];
    
        if (!clientId || !cogntioUrl || !clientSecret) {
          const errorMessage =
            'Missing required environment variables for customai';
          logger.error(errorMessage);
          throw new Error(errorMessage);
        }
    
        const { authToken } = await getTokens(clientId, clientSecret, cogntioUrl);
  

        const { profileToken, secureToken } = getTokensFromRequest(req);
        const seedQuestionsUrl = process.env.GEN_AI_LLM_CHAT_RECORDER_URL;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': authToken,
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken
        };

        const { type } = req.body;
        let url = '';
        let method = 'POST';
        let body = {};

        switch (type) {
            case 'getAll':
                url = `${seedQuestionsUrl}questions?per_page=${req.body.per_page}&page=${req.body.page}`;
                body = {
                    agent_type: req.body.agent_type,
                    question: req.body.question
                };
                break;

            case 'createQuestion':
                url = `${seedQuestionsUrl}question`;
                body = {
                    agent_type: req.body.agent_type,
                    question: req.body.question
                };
                break;

            case 'updateQuestion':
                url = `${seedQuestionsUrl}question`;
                body = {
                    id: req.body.id,
                    agent_type: req.body.agent_type,
                    question: req.body.question
                };
                break;

            case 'deleteQuestion':
                url = `${seedQuestionsUrl}question`;
                method = 'DELETE';
                body = {
                    id: req.body.id,
                    agent_type: req.body.agent_type
                };
                break;

            case 'getSuggestions':
                url = `${seedQuestionsUrl}questions`;
                body = {};
                break;

            default:
                throw new Error('Invalid request type');
        }

        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status}: ${errorText}`);
            return res.status(response.status).json({
                error: 'API request failed',
                details: errorText
            });
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

const cacheBootstrapRouter = express.Router();

cacheBootstrapRouter.post('/', async (req: any, res: any) => {
    const profileToken = GetProfileTokenFromRequest(req);
    const secureToken = GetSecureTokenFromRequest(req);
    logger.info(secureToken);
    const cacheBootstrapUrl = process.env.DATA_INSIGHTS_CACHE_BOOTSTRAP;

    try {
        const { type } = req.body;
        // Fetch tokens
        await initializeSecrets();
        const secrets = getSecrets();

        if (!secrets) {
            const errorMessage = 'Failed to fetch secrets.';
            logger.error("secrets not loadded ");
            throw new Error(errorMessage);
        }

        const clientId = process.env.DATA_INSIGHTS_CLIENT_ID;
        const cogntioUrl = process.env.COGNITO_TOKEN_URL;
        const clientSecret = secrets['DATA_INSIGHTS_CLIENT_SECRET'];

        if (!clientId || !cogntioUrl || !clientSecret) {
            const errorMessage = 'Missing required environment variables for customai';
            throw new Error(errorMessage);
        }

        const { authToken } = await getTokens(clientId, clientSecret, cogntioUrl);

        const headers = {
            'Content-Type': 'application/json',
            Authorization: authToken,
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken,
        };

        let url = '';
        let method = 'GET';
        let body;

        switch (type) {
            case 'cache-bootstrap':
                break;
            case 'cache-reset':
                url = `${cacheBootstrapUrl}/reset`;
                method = 'POST';
                break;
            case 'cache-get-all':
                url = `${cacheBootstrapUrl}/get_all`;
                break;
            case 'cache-selective-reset':
                url = `${cacheBootstrapUrl}/remove_entries`;
                method = 'POST';
                body = JSON.stringify({
                    cache_ids: req.body.cache_ids
                });
                break;
            default:
                throw new Error('Invalid cache operation type');
        }

        const response = await fetch(url, {
            method,
            headers,
            body:JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
           
            return res.status(response.status).json({
                error: 'Cache operation failed',
                details: errorText
            });
        }

        const responseData = await response.json();
        res.status(200).json(responseData);

    } catch (error) {
       
        res.status(500).json({
            error: 'Failed to process cache operation',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Register routes
app.use('/beta/api/seedQuestions', seedQuestionsRouter);
app.use('/beta/api/cacheBootstrap', cacheBootstrapRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});