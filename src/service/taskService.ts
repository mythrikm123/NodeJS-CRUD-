import Task from '../models/task';  
import { v4 as uuid } from 'uuid';

export const createTask = async (
  name: string,
  description: string,
  status: "open" | "inProgress" | "inReview" | "resolved" | "canceled",
  priority: string,
  type: "bug" | "feature" | "improvement",  
  assignee: string,
  loggedInUserId: string 
) => {
  try {
    const task = await Task.create({
      name,
      description,
      status,
      priority,
      type,  
      assignee,
      reporter: uuid(), 
    });

    const createdTask = task.toJSON();

    return {
      status: 201,  
      message: 'Task created successfully',
      data: createdTask,
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
