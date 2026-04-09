import express from 'express';

const router = express.Router();
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import { AIEvaluationSchema } from '../validators/reportEvaluation.validator.js';
import validate from '../middlewares/validate.js';
import { evaluateCandidateAnswer, evaluateInterviewerEvaluation, getCandidateReports, getCandidateReportDetail } from '../controllers/reportEvaluation.controller.js';
import { isValidPersonToEndInterview } from '../middlewares/isValidPersonToEndInterview.middleware.js';
import { isAlreadyEvaluated } from '../middlewares/isAlreadyEvaluated.middleware.js';
import { isCandidate } from '../middlewares/isCandidate.middleware.js';

router.post('/AI-evaluation' , isAuthenticated , validate(AIEvaluationSchema) , evaluateCandidateAnswer);
router.post('/interviewer-evaluation' , isAuthenticated , isValidPersonToEndInterview , isAlreadyEvaluated , evaluateInterviewerEvaluation  );
router.get('/candidate' , isAuthenticated , isCandidate , getCandidateReports);
router.get('/candidate/:reportId' , isAuthenticated , isCandidate , getCandidateReportDetail);


export default router;