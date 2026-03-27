import express from 'express'; 
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import { isValidPersonForInterview } from '../middlewares/isValidPersonForInterview.js';
import { getRoomToken } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/interview/token', isAuthenticated, isValidPersonForInterview, getRoomToken);


export default router;