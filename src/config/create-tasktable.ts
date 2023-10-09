import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid'; 
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST || '127.0.0.1',
  port: parseInt(process.env.PGPORT || '5432', 10),
  username: process.env.POUSER || 'postgres',
  password: process.env.POPASSWORD || '12345',
  database: process.env.PDATABASE || 'practice',
});

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,  
      primaryKey: true,
      allowNull: false
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
    },
  },
  {
    tableName: 'tasks',
  }
);

sequelize
  .sync()
  .then(() => {
    console.log('Task table created successfully.');
  })
  .catch((error) => {
    console.error('Error creating Task table:', error);
  });

export default Task;
