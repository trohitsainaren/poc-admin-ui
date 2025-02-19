
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const router = express.Router();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Middleware to get tokens from request
const getTokensFromRequest = (req: Request) => {
    const profileToken = req.headers['x-lacp-profile'] as string;
    const secureToken = req.headers['x-lacp-secure'] as string;
    return { profileToken, secureToken };
};

// Handle seed questions routes
router.post('/', async(req: Request,res: Response) => {
    try {
        const { profileToken, secureToken } = getTokensFromRequest(req);
        const seedQuestionsUrl = process.env.SEED_QUESTIONS_URL;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secureToken}`,
            'x-lacp-profile': profileToken,
            'x-lacp-secure': secureToken
        };

        const { type } = req.body;
        let url = '';
        let method = 'POST';
        let body = {};

        switch (type) {
            case 'getAll':
                url = `${seedQuestionsUrl}/questions?per_page=${req.body.per_page}&page=${req.body.page}`;
                body = {
                    agent_type: req.body.agent_type,
                    question: req.body.question
                };
                break;

            case 'createQuestion':
                url = `${seedQuestionsUrl}/question`;
                body = {
                    agent_type: req.body.agent_type,
                    question: req.body.question
                };
                break;

            case 'updateQuestion':
                url = `${seedQuestionsUrl}/question`;
                body = {
                    id: req.body.id,
                    agent_type: req.body.agent_type,
                    question: req.body.question
                };
                break;

            case 'deleteQuestion':
                url = `${seedQuestionsUrl}/question`;
                method = 'DELETE';
                body = {
                    id: req.body.id,
                    agent_type: req.body.agent_type
                };
                break;

            case 'getSuggestions':
                url = `${seedQuestionsUrl}/questions`;
                body = {};
                break;

            default:
                throw new Error('Invalid request type');
        }

        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status}: ${errorText}`);
            return res.status(response.status).json({
                error: 'API request failed',
                details: errorText
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Use the router for the seed questions path
app.use('/beta/api/seedQuestions', router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;