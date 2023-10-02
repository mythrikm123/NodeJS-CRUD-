import { DataTypes, Model, Sequelize } from 'sequelize';
import database from '../config/database';

class User extends Model  {
  public id!: string;
  public username!: string;
  public password!: string;
  public name!: string;
  public email!: string;
  public phoneNumber!: string;
  public city!: string;
  public pincode!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: database(),  
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;
