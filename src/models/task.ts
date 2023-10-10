import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { TaskAttributes, TaskCreationAttributes } from '../interfaces/taskInterfaces';

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: string; 
    public name!: string;
    public description!: string;
    public status!: 'open' | 'inProgress' | 'inReview' | 'resolved' | 'canceled';
    public priority!: string;
    public type!: 'bug' | 'feature' | 'improvement';
    public assignee!: string;
    public reporter!: string | null;  
  createdAt: any;
}

Task.init(
    {
        id: {
            type: DataTypes.UUID,  
            defaultValue: uuidv4(), 
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(
                'open',
                'inProgress',
                'inReview',
                'resolved',
                'canceled'
            ),
            allowNull: false,
        },
        priority: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('bug', 'feature', 'improvement'),
            allowNull: false,
        },
        assignee: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reporter: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null
        },
    },
    {
        sequelize:sequelize(),
        tableName: 'tasks',
        timestamps: true,
        updatedAt: 'updatedAt',  
        createdAt: 'createdAt',
    }
);

export default Task;
