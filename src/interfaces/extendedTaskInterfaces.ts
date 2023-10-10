// interfaces/extendedTaskInterfaces.ts
import { Optional } from 'sequelize';
import { TaskAttributes } from './taskInterfaces';

interface ExtendedTaskCreationAttributes extends Optional<TaskAttributes, 'id'> {
  loggedInUserId?: string;
}

export { ExtendedTaskCreationAttributes };
