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
      id: uuid(),
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
