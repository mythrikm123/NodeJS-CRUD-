import express from 'express';
import { createTask, getTasks, updateTask,deleteTask } from '../controller/task';
import { validateTask } from '../middlewares/task-validation';

const router = express.Router();

router.post('/task', validateTask, createTask);
router.get('/tasks', getTasks);
router.put('/task/:id', validateTask, updateTask);
router.delete('/task/:id', deleteTask);

export default router;
