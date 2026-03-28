import express from 'express'; 
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import { isValidPersonForInterview } from '../middlewares/isValidPersonForInterview.js';
import { getRoomToken, runCodeInInterview } from '../controllers/room.controller.js';
import { limiter } from '../middlewares/rateLimiting.middleware.js';

const router = express.Router();

router.post('/interview/token', isAuthenticated, isValidPersonForInterview, getRoomToken);
router.post('/interview/codeExecution' , limiter , isAuthenticated, runCodeInInterview);


export default router;