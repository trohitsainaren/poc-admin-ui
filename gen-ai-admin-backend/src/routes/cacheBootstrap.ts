import express from 'express';
import logger from '../utils/logger.js';
import { GetProfileTokenFromRequest, GetSecureTokenFromRequest } from '../utils/tokenManager/tokenUtils.js';

import { getSecret } from '../utils/getSecret.js';
import { getTokens } from '../utils/tokenManager/tokenStreamingServices.js';
import fetch from 'node-fetch';
const router = express.Router();
router.post('/', async (req: any, res: any) => {
    const profileToken = GetProfileTokenFromRequest(req);
    const secureToken = GetSecureTokenFromRequest(req);
    const cacheBootstrapUrl = process.env.DATA_INSIGHTS_CACHE_BOOTSTRAP;

    try {
        const { type } = req.body;


        const clientId = process.env.DATA_INSIGHTS_CLIENT_ID;
        const cogntioUrl = process.env.COGNITO_TOKEN_URL;
        const clientSecret = await getSecret('DATA_INSIGHTS_CLIENT_SECRET');


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
            body: JSON.stringify(body)
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
        logger.error('Error processing cache operation:', error);
        res.status(500).json({
            error: 'Failed to process cache operation',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
export default router;