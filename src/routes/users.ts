import express from 'express';
import { createUser } from '../controller/users';
import { loginUser } from '../controller/users';
import { validateUser } from '../middlewares/user-validation'; 
import {validateUserLogin} from '../middlewares/user-validation'

const router = express.Router();

router.post('/signup', validateUser, createUser);
router.post('/login' ,validateUserLogin,loginUser)

export default router;