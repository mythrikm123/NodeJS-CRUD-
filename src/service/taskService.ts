import Task from '../models/task';  

export const createTask = async (
  name: string,
  description: string,
  status: "open" | "inProgress" | "inReview" | "resolved" | "canceled",
  priority: string,
  type: "bug" | "feature" | "improvement",  
  assignee: string,
  reporter: string
) => {
  try {
    const task = await Task.create({
      name,
      description,
      status,
      priority,
      type,  
      assignee,
      reporter,
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