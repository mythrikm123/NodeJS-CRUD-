import Task from '../models/task';
import { v4 as uuid } from 'uuid';
import { ExtendedTaskCreationAttributes } from '../interfaces/extendedTaskInterfaces';

export const createTask = async (
  taskInput: ExtendedTaskCreationAttributes,
  loggedInUserId: string
) => {
  try {
    const { loggedInUserId: omittedUserId, ...taskAttributes } = taskInput;

    const task = await Task.create({
      id: loggedInUserId,
      ...taskAttributes,
      reporter: uuid(),
    });

    const createdTask = task.toJSON();

    return {
      id: createdTask.id,
      name: createdTask.name,
      description: createdTask.description,
      status: createdTask.status,
      priority: createdTask.priority,
      type: createdTask.type,
      assignee: createdTask.assignee,
      reporter: createdTask.reporter,
      updatedAt: createdTask.updatedAt,
      createdAt: createdTask.createdAt,
    };
  } catch (error) {
    console.error('Error creating task:', error);

    return {
      status: 500,
      message: 'Failed to create task',
      data: null,
    };
  }
};

export const getPaginatedTasks = async (
  page: number,
  pageSize: number,
  loggedInUserId: string | undefined
) => {
  try {
    const offset = (page - 1) * pageSize;
    const tasks = await Task.findAndCountAll({
      where: {
      },
      limit: pageSize,
      offset: offset,
    });

    const formattedTasks = tasks.rows.map((task) => ({
      id: task.id,
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      type: task.type,
      assignee: task.assignee,
      reporter: task.reporter,
      updatedAt: task.update,
      createdAt: task.createdAt,
    }));

    return {
      tasks: formattedTasks,
      total: tasks.count,
    };
  } catch (error) {
    console.error('Error retrieving paginated tasks:', error);
    return {
      status: 500,
      message: 'Failed to retrieve tasks',
      data: null,
    };
  }
};
export const updateTask = async (taskId: string, taskInput: ExtendedTaskCreationAttributes) => {
  try {
    const existingTask = await Task.findByPk(taskId);

    if (!existingTask) {
      return {
        status: 400,
        message: 'Unable to update task: Task not found',
        data: null,
      };
    }

    existingTask.set(taskInput);
    await existingTask.save();

    const updatedTask = existingTask.toJSON();

    return {
      id: updatedTask.id,
      name: updatedTask.name,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      type: updatedTask.type,
      assignee: updatedTask.assignee,
      reporter: updatedTask.reporter,
      updatedAt: updatedTask.updatedAt,
      createdAt: updatedTask.createdAt,
    };
  } catch (error) {
    console.error('Failed to update task:', error);

    return {
      status: 500,
      message: 'Failed to update task',
      data: null,
    };
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const deletedTask = await Task.destroy({
      where: {
        id: taskId,
      },
    });

    if (deletedTask === 0) {
      return {
        status: 404,
        message: 'Task not found',
        data: null,
      };
    }

    return {
      status: 200,
      message: 'Task deleted successfully',
      data: null,
    };
  } catch (error) {
    console.error('Failed to delete task:', error);

    return {
      status: 500,
      message: 'Failed to delete task',
      data: null,
    };
  }
};
