import express from 'express';

import { register , login , logout , me } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import validate from '../middlewares/validate.js';
import { loginSchemaValidator, signupSchemaValidator } from '../validators/authUser.validator.js';

const router = express.Router();

//auth routes
router.post('/register' ,validate(signupSchemaValidator), register);
router.post('/login', (req,res,next) => {console.log('request.body ::::::', req.body); next() }, validate(loginSchemaValidator), login);
router.get('logout' , isAuthenticated , logout);
router.get('/me' , isAuthenticated , me);


export default router;