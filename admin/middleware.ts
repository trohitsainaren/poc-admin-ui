import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
    const secure_token = req.headers.get('x-amzn-oidc-accesstoken') || req.headers.get('x-lacp-secure');
    const profile_token = req.headers.get('x-amzn-oidc-data') || req.headers.get('x-lacp-profile');

    if (secure_token || profile_token) {
        console.log(`Middleware UI running with secure_token: recieved, profile_token: recieved`);
        const response = NextResponse.next();

        if (profile_token) {
            response.headers.set('x-lacp-profile', profile_token);
            response.cookies.set('x-lacp-profile', profile_token, {
                path: '/',
                maxAge: 60 * 60 * 4,
                httpOnly: false,
                secure: true,
                sameSite: 'lax',
            });
        }

        if (secure_token) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const decoded = jwt.decode(secure_token) as { 'cognito:groups': string[] } | null;
            response.headers.set('x-lacp-secure', secure_token);
            response.cookies.set('x-lacp-secure', secure_token, {
                path: '/',
                maxAge: 60 * 60 * 4,
                httpOnly: false,
                secure: true,
                sameSite: 'lax',
            });
        }


        return response;
    }

    const errorUrl = new URL(req.url);

    if (!secure_token && !profile_token) {
        errorUrl.pathname = '/error/403';
        return NextResponse.redirect(errorUrl);
    }

    if (!secure_token) {
        return NextResponse.redirect(new URL('/error/401', req.url));
    }

    // Default redirect in case of an unexpected issue
    return NextResponse.redirect(new URL('/error/403', req.url));
}

export const config = {
    matcher: ['/'],
};