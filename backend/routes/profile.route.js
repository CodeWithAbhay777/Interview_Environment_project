import express from 'express';
import { submitCandidateProfile } from '../controllers/candidateProfile.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { submitRecruiterProfile } from '../controllers/recruiterProfile.controller.js';
import{  candidateProfileSchema, interviewerProfileSchema } from '../validators/profileUserValidator.js';
import validate from '../middlewares/validate.js';

const router = express.Router();

//candidate
router.post('/candidate',isAuthenticated  ,upload.fields([{name : "profilePhoto", maxCount : 1} , {name : "resume" , maxCount : 1}]) , validate(candidateProfileSchema),submitCandidateProfile)


//recruiter
router.post('/recruiter' , isAuthenticated, upload.fields([{name : "profilePhoto" , maxCount : 1}])  ,validate(interviewerProfileSchema), submitRecruiterProfile );

export default router;