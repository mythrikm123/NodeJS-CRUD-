import express from 'express';
import { createUser ,getProfile} from '../controller/users';
import { loginUser  } from '../controller/users';
import { validateUser } from '../middlewares/user-validation'; 
import {validateUserLogin} from '../middlewares/user-validation'
import { authenticateToken } from '../middlewares/authentication';

const router = express.Router();

router.post('/signup', validateUser, createUser);
router.post('/login' ,validateUserLogin,loginUser)
router.get('/profile/:username', getProfile);

export default router;