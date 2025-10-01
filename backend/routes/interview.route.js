import express from 'express';
import { 
  scheduleInterview, 
  getAllInterviews, 
  updateInterviewStatus, 
  getInterviewById 
} from '../controllers/interview.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
import validate from '../middlewares/validate.js';
import { scheduleInterviewSchema } from '../validators/interview.validator.js';

const router = express.Router();

// Interview routes
router.post('/schedule', isAuthenticated, isAdmin, validate(scheduleInterviewSchema), scheduleInterview);
router.get('/all', isAuthenticated, isAdmin, getAllInterviews);
router.get('/:id', isAuthenticated, getInterviewById);
router.put('/:id/status', isAuthenticated, isAdmin, updateInterviewStatus);

export default router;