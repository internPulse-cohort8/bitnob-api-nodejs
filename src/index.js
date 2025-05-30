const port = process.env.PORT || 4000;

import express, { urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import walletRoute from './routes/walletRoute.js';
import { config } from './configs/config.env.js';
import { customersRouter } from './routes/customersRoutes.js';
import { BaseError } from './errors/errors.js';

//DB connection
import sequelize from './db/config.js';
import './models/wallet.js';
import './models/transaction.js'

const app = express();

const SERVER_PORT = config.SERVER_PORT || 4000;
const BASE_URL = '/api/v1';

app.use(hpp());
app.use(helmet());
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(compression());
app.use(json({ limit: '200mb' }));
app.use(urlencoded({ extended: true, limit: '200mb' }));

app.use('/api/wallet', walletRoute);

app.use(`${BASE_URL}/customers`, customersRouter);

app.use((error, _req, res, next) => {
  if (error instanceof BaseError) {
    res.status(error.statusCode).json(error.toJSON());
  }
  next();
});

const start = async () => {
  try {
    // Connect to Database
    await sequelize.authenticate();
    console.log('Connected to postgres DB');

    // Sync all table models
    await sequelize.sync({alter: true})
    console.log("Models synchronized");

    // Start the server
    app.listen(SERVER_PORT, ()=> {
    console.log(`Server running on port: ${SERVER_PORT}`)
  });
  } catch (error) { 
    console.log('Error starting the server', error);
  };
}

start();

