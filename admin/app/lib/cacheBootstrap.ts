import Cookies from 'js-cookie';
import { getEnvironment ,getBaseUrl} from './utils';



// const env = getEnvironment

// let bootstrapUrl = '';

const env = getEnvironment();
const localUrl = (window.location.hostname.includes("localhost")) ? "":"";
const bootstrapUrl = getBaseUrl(env,'cacheBootstrap');
export const cacheBootstrap = async () => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const authToken = `Bearer ${secureToken}`;
  

    try {
        
        const res = await fetch(`${localUrl}${bootstrapUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-lacp-profile': profileToken,
                'x-lacp-secure': secureToken,
                Authorization: authToken
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch questions:', res.statusText);
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error during cache bootstrap:', error);
        return [];
    }
};

export const cacheGetAll = async () => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const authToken = `Bearer ${secureToken}`;
 

    try {
        const res = await fetch(`${localUrl}${bootstrapUrl}/get_all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authToken,
                'x-lacp-profile': profileToken,
                'x-lacp-secure': secureToken,
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch questions:', res.statusText);
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error during cache bootstrap:', error);
        return [];
    }
};

export const cacheBootstrapReset = async () => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
 

    try {
        const res = await fetch(`${localUrl}${bootstrapUrl}/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-lacp-profile': profileToken,
                'x-lacp-secure': secureToken,
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch questions:', res.statusText);
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error during cache bootstrap:', error);
        return [];
    }
};

export const cacheSelectiveReset = async (cache_ids: number[]) => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
   
        cache_ids: cache_ids
    });

    try {
        const res = await fetch(`${localUrl}${bootstrapUrl}/remove_entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-lacp-profile': profileToken,
                'x-lacp-secure': secureToken,
            },
            body: body,
        });

        if (!res.ok) {
            console.error('Failed to fetch questions:', res.statusText);
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error during cache bootstrap:', error);
        return [];
    }
};
