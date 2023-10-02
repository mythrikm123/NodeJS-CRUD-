"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function initializeDatabase() {
    const POUSER = process.env.POUSER;
    const POPASSWORD = process.env.POPASSWORD;
    const POHOST = process.env.PGHOST || '127.0.0.1';
    let PSPORT = Number(process.env.PGPORT) || 5432;
    const PATABASE = process.env.PDATABASE;
    const DIALECT = 'postgres';
    const LOGGING = false;
    const database = new sequelize_1.Sequelize(PATABASE, POUSER, POPASSWORD, {
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
exports.default = initializeDatabase;
