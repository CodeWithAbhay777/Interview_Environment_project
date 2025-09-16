import express from 'express';


import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import validate from '../middlewares/validate.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
import { jobSchema } from '../validators/jobs.Validator.js';
import {createJob, getAllJobsByAdmin} from '../controllers/jobs.controller.js';

const router = express.Router();

//admin posting job
router.post('/create' , isAuthenticated , validate(jobSchema) , isAdmin , createJob );
router.get('/admin', isAuthenticated , isAdmin , getAllJobsByAdmin );


export default router;