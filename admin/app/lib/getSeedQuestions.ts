/* eslint-disable prefer-const */
 
import Cookies from 'js-cookie';
 
export const getAllSeedQuestions = async (agent_type: string, page: number = 1, per_page: number = 5, question?: string,) => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify(question ? {
        "agent_type": agent_type,
        "question": question,
        "type": "getAll",
        "per_page": per_page,
        "page": page
 
    } : {
        "agent_type": agent_type,
        "type": "getAll",
        "per_page": per_page,
        "page": page
    });
    const res = await fetch(`http://localhost:3001/beta/api/seedQuestions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken
        },
        body: body,
 
 
    })
 
    if (!res.ok) {
        console.error('Failed to fetch questions:', res.statusText);
        return [];
    }
 
    let data = await res.json();
    return data;
}
export const createSeedQuestion = async (agent_type: string, question: string) => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
        "agent_type": agent_type,
        "question": question,
        "type": "createQuestion"
    });
 
    const res = await fetch(`http://localhost:3001/beta/api/seedQuestions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken
        },
        body: body,
 
 
    });
 
    if (!res.ok) {
        console.error('Failed to fetch questions:', res.statusText);
        return [];
    }
 
    let data = await res.json();
 
    return data;
}
export const updateSeedQuestion = async (agent_type: string, question: string, id: string) => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
        "id": id,
        "agent_type": agent_type,
        "question": question,
        "type": "updateQuestion"
    });
 
    const res = await fetch(`http://localhost:3001/beta/api/seedQuestions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken
        },
        body: body,
 
 
    });
 
    if (!res.ok) {
        console.error('Failed to fetch questions:', res.statusText);
        return [];
    }
 
    let data = await res.json();
 
    return data;
}
 
export const deleteSeedQuestions = async (agent_type: string, id: string) => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
        "id": id,
        "agent_type": agent_type,
        "type": "deleteQuestion"
    });
 
    const res = await fetch(`http://localhost:3001/beta/api/seedQuestions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken
        },
        body: body,
 
 
    });
 
    if (!res.ok) {
        console.error('Failed to fetch questions:', res.statusText);
        return [];
    }
 
    let data = await res.json();
 
    return data;
}
 
export const getAllSuggestionsForSeeds = async () => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const body = JSON.stringify({
        "type": "getSuggestions",
    });
    const res = await fetch(`http://localhost:3001/beta/api/seedQuestions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken
        },
        body: body,
    })
 
    if (!res.ok) {
        console.error('Failed to fetch questions:', res.statusText);
        return [];
    }
 
    let data = await res.json();
    return data;
}