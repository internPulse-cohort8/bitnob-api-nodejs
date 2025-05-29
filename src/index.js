import express, { urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { createWallet } from './controllers/wallet.js';
import { config } from './configs/config.env.js';
import { customersRouter } from './routes/customersRoutes.js';
import { BaseError } from './errors/errors.js';

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

createWallet(); // Example usage of createWallet function

app.use(`${BASE_URL}/customers`, customersRouter);

app.use((error, _req, res, next) => {
  if (error instanceof BaseError) {
    res.status(error.statusCode).json(error.toJSON());
  }
  next();
});

app.listen(SERVER_PORT, ()=> {
    console.log(`Server running on port: ${SERVER_PORT}`)
})