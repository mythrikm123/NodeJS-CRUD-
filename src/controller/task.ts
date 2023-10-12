import { Request, Response, NextFunction } from 'express';
import * as taskService from '../service/taskService';
import { authenticateToken } from '../middlewares/authentication';
import AuthenticatedRequest from '../interfaces/authenticatedRequest';
import { ExtendedTaskCreationAttributes } from '../interfaces/extendedTaskInterfaces';

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    authenticateToken(req, res, async () => {
      const { name, description, status, priority, type, assignee } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          status: 'nok',
          message: 'Unauthorized',
        });
      }

      const loggedInUserId = user.id;

      const responseData = await taskService.createTask(
        {
          name,
          description,
          status,
          priority,
          type,
          assignee,
          reporter: loggedInUserId, // Use loggedInUserId as reporter
        },
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


export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.id;
    const { name, description, status, priority, type, assignee, reporter } = req.body;



    const taskUpdateData: ExtendedTaskCreationAttributes = {
      name,
      description,
      status,
      priority,
      type,
      assignee,
      reporter: reporter || undefined,
    };


    console.log('Updating task with data:', taskUpdateData);

    const responseData = await taskService.updateTask(
      taskId,
      taskUpdateData,
    );

    console.log('Task updated successfully:', responseData);

    res.status(200).json({
      status: 'ok',
      message: 'Task updated successfully',
      data: responseData,
    });
  } catch (err) {
    console.error('Error updating task:', err);
    next(err);
  }
};
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.id;

    const deleteResult = await taskService.deleteTask(taskId);

    if (deleteResult.status === 200) {
      res.status(200).json({
        status: 'ok',
        message: 'Task deleted successfully',
        data: null,
      });
    } else if (deleteResult.status === 404) {
      res.status(404).json({
        status: 'nok',
        message: 'Task not found',
        data: null,
      });
    } else {
      res.status(500).json({
        status: 'nok',
        message: 'Failed to delete task',
        data: null,
      });
    }
  } catch (err) {
    console.error('Error deleting task:', err);
    next(err);
  }
};