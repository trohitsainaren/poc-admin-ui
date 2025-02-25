import Cookies from 'js-cookie';
 
export const cacheBootstrap = async () => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
        type: 'cache-bootstrap',
    });
 
    try {
        const res = await fetch(`http://localhost:3001/beta/api/cacheBootstrap`, {
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
 
export const cacheGetAll = async () => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
        type: 'cache-get-all',
    });
 
    try {
        const res = await fetch(`http://localhost:3001/beta/api/cacheBootstrap`, {
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
 
export const cacheBootstrapReset = async () => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
        type: 'cache-reset',
    });
 
    try {
        const res = await fetch(`http://localhost:3001/beta/api/cacheBootstrap`, {
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
 
export const cacheSelectiveReset = async (cache_ids: number[]) => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
        type: 'cache-selective-reset',
        cache_ids: cache_ids
    });
 
    try {
        const res = await fetch(`http://localhost:3001/beta/api/cacheBootstrap`, {
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