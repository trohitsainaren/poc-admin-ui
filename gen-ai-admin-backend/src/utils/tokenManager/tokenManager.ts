import { getTokens } from "./tokenStreamingServices.js";


export class TokenManager {
    private static instance: TokenManager;
    private profileToken: string | null = null;
    private authToken: string | null = null;

    private constructor() {}

    static getInstance() {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    async loadTokens(clientId: string, clientSecret: string, tokenUrl: string) {
        if (!this.authToken || !this.profileToken) {
            const tokens = await getTokens(clientId, clientSecret, tokenUrl);
            this.authToken = tokens.authToken;
            this.profileToken = tokens.profileToken
        }
    }

    getAuthToken() {
        return this.authToken;
    }

    getProfileToken() {
        return this.profileToken;
    }

    setProfileToken(rawToken: string) {
        this.profileToken = rawToken;
    }

    setAuthToken(rawToken: string) {
        this.authToken = `Bearer ${rawToken}`;
    }

    async refreshTokens(clientId: string, clientSecret: string, tokenUrl: string) {
        const tokens = await getTokens(clientId, clientSecret, tokenUrl);
        this.authToken = tokens.authToken;
    }
}