/* eslint-disable prefer-const */
/* eslint-disable */

import Cookies from 'js-cookie';
import { getBaseUrl, getEnvironment } from './utils';
const env = getEnvironment();
const seedQuestionsUrl = getBaseUrl(env,'seedQuestions');

const localUrl = (window.location.hostname.includes("localhost")) ? "":"";


const API_BASE_URL = 'http://localhost:5000/api';

export const getAllSeedQuestions = async (
    agent_type: string,
    page: number = 1,
    per_page: number = 5,
    question?: string,
) => {
    try {
        const profileToken = Cookies.get('x-lacp-profile') || '';
        const secureToken = Cookies.get('x-lacp-secure') || '';

        const body = question 
            ? { agent_type, question, per_page, page }
            : { agent_type, per_page, page };

        const res = await fetch(
            `${API_BASE_URL}/questions?per_page=${per_page}&page=${page}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-lacp-profile': profileToken,
                    'x-lacp-secure': secureToken
                },
                body: JSON.stringify(body),
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        throw error;
    }
};

export const createSeedQuestion = async (agent_type: string, question: string) => {
    try {
        const profileToken = Cookies.get('x-lacp-profile') || '';
        const secureToken = Cookies.get('x-lacp-secure') || '';

        const res = await fetch(
            `${API_BASE_URL}/question`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-lacp-profile': profileToken,
                    'x-lacp-secure': secureToken
                },
                body: JSON.stringify({
                    agent_type,
                    question,
                }),
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to create question:', error);
        throw error;
    }
};
export const updateSeedQuestion = async (agent_type: string, question: string, id: string) => {
    const profileToken = Cookies.get('x-lacp-profile') || '';
    const secureToken = Cookies.get('x-lacp-secure') || '';
    const authToken = `Bearer ${secureToken}`;
    const body = JSON.stringify({
        "id": id,
        "agent_type": agent_type,
        "question": question,
       
    });

    const res = await fetch(`${localUrl}${seedQuestionsUrl}question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
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
    const authToken = `Bearer ${secureToken}`;
    const body = JSON.stringify({
        "id": id,
        "agent_type": agent_type,
 
    });

    const res = await fetch(`${localUrl}${seedQuestionsUrl}question`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
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
    const authToken = `Bearer ${secureToken}`;
    const body = JSON.stringify({
        
    });
    const res = await fetch(`${localUrl}${seedQuestionsUrl}questions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
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