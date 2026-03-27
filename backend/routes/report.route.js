import express from 'express';

const router = express.Router();
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import { AIEvaluationSchema } from '../validators/reportEvaluation.validator.js';
import validate from '../middlewares/validate.js';
import { evaluateCandidateAnswer } from '../controllers/reportEvaluation.controller.js';

router.post('/AI-evaluation' , validate(AIEvaluationSchema) , evaluateCandidateAnswer);


export default router;