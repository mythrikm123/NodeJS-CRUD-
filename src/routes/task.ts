import express from 'express';
import { createTask, getTasks } from '../controller/task';
import { validateTask } from '../middlewares/task-validation';

const router = express.Router();

router.post('/task', validateTask, createTask);
router.get('/tasks', getTasks);

export default router;
