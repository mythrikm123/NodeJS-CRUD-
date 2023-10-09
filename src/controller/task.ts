import { Request, Response, NextFunction } from 'express';
import * as taskService from '../service/taskService';
import { authenticateToken } from '../middlewares/authentication';  

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        authenticateToken(req, res, async () => {
            const {
                name,
                description,
                status,
                priority,
                type,
                assignee,
            } = req.body;

            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    status: 'nok',
                    message: 'Unauthorized',
                });
            }

            const loggedInUserId = user.id;

            const responseData = await taskService.createTask(
                name,
                description,
                status,
                priority,
                type,
                assignee,
                loggedInUserId
            );

            res.status(201).json({
                status: 'ok',
                message: 'Task created successfully',
                data: responseData,
            });
        });
    } catch (err) {
        next(err);
    }
};
