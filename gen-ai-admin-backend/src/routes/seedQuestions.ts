import express from 'express';
import logger from '../utils/logger.js';
import { GetProfileTokenFromRequest, GetSecureTokenFromRequest } from '../utils/tokenManager/tokenUtils.js';
import { getEnvVariable } from '../utils/getEnv.js';
import { TokenManager } from '../utils/tokenManager/tokenManager.js';
import { getSecret } from '../utils/getSecret.js';
import { getTokens } from '../utils/tokenManager/tokenStreamingServices.js';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/', async (req: any, res: any) => {
    const profileToken = GetProfileTokenFromRequest(req);
    const secureToken = GetSecureTokenFromRequest(req);

    const seedQuestionsUrl = getEnvVariable('STUDY_ASSISTANT_QUERY_QUESTION_URL');

    try {
        const { type, agent_type, id, question } = req.body;

        if (!question || !id) {
            logger.info(`Question: ${question}`);
        }

        const tokenManager = TokenManager.getInstance();

        const clientId = getEnvVariable('GEN_AI_LLM_CLIENT_ID');
        const cognitoUrl = getEnvVariable('COGNITO_TOKEN_URL');
        const clientSecret = await getSecret('GEN_AI_LLM_CLIENT_SECRET');

        if (!clientId || !cognitoUrl || !clientSecret) {
            const errorMessage = 'Missing required environment variables for customai';
            logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        const { authToken } = await getTokens(clientId, clientSecret, cognitoUrl);
        tokenManager.setAuthToken(authToken);
        tokenManager.setProfileToken(profileToken);

        const headers = {
            'Content-Type': 'application/json',
            Authorization: authToken,
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken,
        };

        let getQuestionUrl = '';
        let body = null;
        let method = '';

        switch (type) {
            case 'getAll':
                getQuestionUrl = `${seedQuestionsUrl}questions?per_page=${req.body.per_page}&page=${req.body.page}`;
                body = JSON.stringify({
                    agent_type: req.body.agent_type,
                    question: req.body.question,
                });
                method = 'POST';
                break;

            case 'getQuestion':
                getQuestionUrl = `${seedQuestionsUrl}question/${req.body.questionId}`;
                method = 'GET';
                break;

            case 'createQuestion':
                getQuestionUrl = `${seedQuestionsUrl}question`;
                body = JSON.stringify({
                    agent_type: agent_type,
                    question: req.body.question,
                    tenant_id: req.body.tenant_id,
                });
                method = 'POST';
                break;

            case 'updateQuestion':
                getQuestionUrl = `${seedQuestionsUrl}question`;
                body = JSON.stringify({
                    id: req.body.id,
                    agent_type: agent_type,
                    question: req.body.question,
                    tenant_id: req.body.tenant_id,
                });
                method = 'POST';
                break;

            case 'getSuggestions':
                getQuestionUrl = `${seedQuestionsUrl}questions`;
                body = JSON.stringify({});
                method = 'POST';
                break;

            case 'deleteQuestion':
                getQuestionUrl = `${seedQuestionsUrl}question`;
                body = JSON.stringify({
                    id: req.body.id,
                    agent_type: agent_type,
                });
                method = 'DELETE';
                break;

            default:
                res.status(400).json({ error: 'Invalid request type' });
                return;
        }

        const response = await fetch(getQuestionUrl, {
            method,
            headers,
            body: body || undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`Failed to process request. HTTP ${response.status}: ${errorText}`);
            return res.status(response.status).json({
                error: 'Failed to process request',
                details: errorText,
            });
        }

        const responseData = await response.json();
        res.status(200).json(responseData);
    } catch (error) {
        logger.error('Error processing query questions from seedQuestions:', error);
        res.status(500).json({
            error: 'Failed to process query questions',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;
