import { Request, Response, NextFunction } from 'express';
import { ProcessTokenToNextRequest, GetProfileTokenFromRequest, GetUserProfileName } from './utils/tokenManager/tokenUtils.js';
import isUserInGroup from './utils/userValidation.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(`[${new Date().toISOString()}] Middleware invoked for ${req.method} ${req.path}`);

    if (req.path.includes('/health')) {
        next(); // Do not return here
        return;
    }

    try {
        if (shouldSkipValidation()) {
            ProcessTokenToNextRequest(req);
            next(); // Ensure next() is called correctly
            return;
        }

        const token = GetProfileTokenFromRequest(req);
        if (!token) {
            console.log("Token Missing");
            res.status(401).json({ message: 'Token Missing' });
            return;
        }

        const username = GetUserProfileName(req);
        if (!username) {
            console.log('[Middleware]: Request denied: Invalid token format or missing username');
            res.status(401).json({ message: 'Token decoding failed or username missing' });
            return;
        }

        const isInGroup = await isUserInGroup(username);
        console.log(`[Middleware]: User "${username}" authorization status: isInGroup=${isInGroup}`);

        if (!isInGroup) {
            console.log(`[Middleware]: User "${username}" is not authorized`);
            res.status(401).json({ message: 'Not Authorized' });
            return;
        }

        ProcessTokenToNextRequest(req);
        next();
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

function shouldSkipValidation(): boolean {
    const restrictAccess = process.env.ENABLE_RESTRICTED_ACCESS;
    return !restrictAccess || restrictAccess.toLowerCase() === 'false';
}
