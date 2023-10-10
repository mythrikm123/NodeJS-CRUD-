import { Optional } from 'sequelize';

interface TaskAttributes {
    id: string;  
    name: string;
    description: string;
    status: 'open' | 'inProgress' | 'inReview' | 'resolved' | 'canceled';
    priority: string;
    type: 'bug' | 'feature' | 'improvement';
    assignee: string;
    reporter: string | null; 
    createdAt?: Date; 
    updatedAt?: Date
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> {}

export { TaskAttributes, TaskCreationAttributes };
