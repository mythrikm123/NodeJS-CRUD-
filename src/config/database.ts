import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export default function initializeDatabase() {
  const POUSER = process.env.POUSER as string;
  const POPASSWORD = process.env.POPASSWORD as string;
  const POHOST = process.env.PGHOST || '127.0.0.1';
  let PSPORT = Number(process.env.PGPORT) || 5432;
  const PATABASE = process.env.PDATABASE as string;
  const DIALECT = 'postgres';
  const LOGGING = false;

  const database = new Sequelize(PATABASE, POUSER, POPASSWORD, {
    host: POHOST,
    port: PSPORT,
    dialect: DIALECT,
    logging: LOGGING, 
  });

  // database
  //   .authenticate()
  //   .then(() => {
  //     console.log('Database connected successfully.');
  //   })
  //   .catch((error: Error) => {
  //     console.error('Unable to connect to the database:', error);
  //   });

  return database;
}
