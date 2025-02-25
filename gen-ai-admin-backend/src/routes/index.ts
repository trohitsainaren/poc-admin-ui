import express from 'express';
import seedQuestions from './seedQuestions.js';
import cacheBootstrap from './cacheBootstrap.js';

const router = express.Router();
router.use('/seedQuestions', seedQuestions);
router.use('/cacheBootstrap', cacheBootstrap);
export default router;