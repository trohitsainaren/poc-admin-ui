"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// import fetch from 'node-fetch';
dotenv_1.default.config();
const router = express_1.default.Router();
const SEED_QUESTIONS_URL = process.env.SEED_QUESTIONS_URL || 'http://localhost:3001/api/seedQuestions';
router.use(express_1.default.json());
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const profileToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a['x-lacp-profile']) || '';
    const secureToken = ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b['x-lacp-secure']) || '';
    try {
        const { type, agent_type, id, question, page = 1, per_page = 5, tenant_id } = req.body;
        const headers = {
            'Content-Type': 'application/json',
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken
        };
        let endpoint = SEED_QUESTIONS_URL;
        let method = 'POST';
        let body = {};
        switch (type) {
            case 'getAll':
                endpoint += `?per_page=${per_page}&page=${page}`;
                body = { agent_type, question };
                break;
            case 'getQuestion':
                endpoint += `/${id}`;
                method = 'GET';
                body = null;
                break;
            case 'createQuestion':
                body = { agent_type, question, tenant_id };
                break;
            case 'updateQuestion':
                body = { id, agent_type, question, tenant_id };
                break;
            case 'deleteQuestion':
                method = 'DELETE';
                body = { id, agent_type };
                break;
            case 'getSuggestions':
                body = {};
                break;
            default:
                return res.status(400).json({ error: 'Invalid request type' });
        }
        // Ensuring the body is only included when necessary
        const fetchOptions = Object.assign({ method,
            headers }, (body && method !== 'GET' ? { body: JSON.stringify(body) } : {}));
        const response = yield fetch(endpoint, fetchOptions);
        if (!response.ok) {
            const errorText = yield response.text();
            console.error(`Failed request. HTTP ${response.status}: ${errorText}`);
            return res.status(response.status).json({ error: 'Request failed', details: errorText });
        }
        const responseData = yield response.json();
        return res.status(200).json(responseData);
    }
    catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
}));
exports.default = router;
