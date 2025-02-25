import { Request } from 'express';
import jwt from 'jsonwebtoken';

export function GetProfileTokenFromRequest(req: Request): string {
    let profileToken = req.headers['x-lacp-profile'];
    if (Array.isArray(profileToken)) {
        profileToken = profileToken[0];
    }
    return typeof profileToken === 'string' ? profileToken.replace(/=/g, '') : '';
}

export function GetProfileTokenNoChange(req: Request): string {
    let profileToken = req.headers['x-lacp-profile'];
    if (Array.isArray(profileToken)) {
        profileToken = profileToken[0];
    }
    return typeof profileToken === 'string' ? profileToken : '';
}

export function GetSecureTokenFromRequest(req: Request): string {
    let secureToken = req.headers['x-lacp-secure'];
    if (Array.isArray(secureToken)) {
        secureToken = secureToken[0];
    }
    return typeof secureToken === 'string' ? secureToken : '';
}

export function GetUserProfileName(req: Request): string {
    const profileToken = GetProfileTokenFromRequest(req);
    try {
        const decoded = jwt.decode(profileToken);
        if (decoded && typeof decoded === 'object' && 'username' in decoded) {
            return (decoded as { username: string }).username;
        } else {
            throw new Error('Username not found in decoded token');
        }
    } catch (error) {
        const err = error as Error;
        throw new Error(`Error decoding token: ${err.message}`);
    }
}


export function getUsernameFromToken(token: string): string | null {
    try {
        // Split the token to extract the payload
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        // Decode the payload from Base64
        const payload = JSON.parse(atob(parts[1]));

        // Return the `username` field if it exists
        return payload.username || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}


export function ProcessTokenToNextRequest(req: Request) {
    let profileToken = GetProfileTokenNoChange(req);
    if (typeof profileToken === 'string') {
        req.headers['x-lacp-profile'] = profileToken;
    }
}
