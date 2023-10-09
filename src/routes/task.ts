import express from 'express';
import { createTask } from '../controller/task';
import {validateTask } from '../middlewares/task-validation'; 

const router = express.Router();

router.post('/task', validateTask, createTask);

export default router;