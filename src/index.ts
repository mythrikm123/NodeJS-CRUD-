import express from 'express';
import bodyParser from 'body-parser';
import initializeDatabase from './config/database';
import Router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const database = initializeDatabase();
app.use('/', Router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});