import express from 'express';
import userRoutes from './users';  
import taskRoutes from './task'

const router = express.Router();

router.use('/user', userRoutes);
router.use('/task', taskRoutes);

export default router;