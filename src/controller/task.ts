import { Request, Response, NextFunction } from 'express';
import * as taskService from '../service/taskService';
import { authenticateToken } from '../middlewares/authentication';
import AuthenticatedRequest from '../interfaces/authenticatedRequest';

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
      const responseData = await taskService.createTask({
        name,
        description,
        status,
        priority,
        type,
        assignee,
        reporter: '',
      }, loggedInUserId);

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

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    authenticateToken(req, res, async () => {
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const pageSize: number = parseInt(req.query.pageSize as string, 10) || 10;

      const loggedInUserId = req.user?.id;
      const tasks = await taskService.getPaginatedTasks(page, pageSize, loggedInUserId);
      res.status(200).json({
        status: 'ok',
        message: 'Tasks retrieved successfully',
        data: tasks,
      });
    });
  } catch (err) {
    next(err);
  }
};

