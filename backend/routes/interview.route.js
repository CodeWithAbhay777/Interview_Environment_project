import express from 'express';
import { 
  scheduleInterview, 
  getAllInterviewsOfJob, 
  updateInterviewStatus, 
  getInterviewById, 
  getAllInterviews,
  getAllCandidateInterviews,
  getAllRecruiterInterviews
} from '../controllers/interview.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
import validate from '../middlewares/validate.js';
import { scheduleInterviewSchema } from '../validators/interview.validator.js';

const router = express.Router();

// Interview routes
router.get('/', isAuthenticated , isAdmin , getAllInterviews);
router.post('/schedule', isAuthenticated, isAdmin, validate(scheduleInterviewSchema), scheduleInterview);
router.get('/all', isAuthenticated, isAdmin, getAllInterviewsOfJob);

//candidates can see their interviews (MUST come before /:id route)
router.get('/candidate' , isAuthenticated, getAllCandidateInterviews);
router.get('/recruiter' , isAuthenticated, getAllRecruiterInterviews);
// interviewers can see their interviews

router.get('/:id', isAuthenticated, getInterviewById);
router.put('/:id/status', isAuthenticated, isAdmin, updateInterviewStatus);


export default router;