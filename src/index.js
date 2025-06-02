import dotenv from 'dotenv';
import express, { urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

// Routes
import walletRoute from './routes/walletRoute.js';
import { customersRouter } from './routes/customersRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import btcAddressRoutes from './routes/btcAddressRoutes.js';

// Config and DB
import { config } from './configs/config.env.js';
import sequelize from './db/config.js';
import { BaseError } from './errors/errors.js';

// Models
import './models/wallet.js';
import './models/transaction.js';
import { transactionRoute } from './routes/transaction.js';
import './models/btcAddressModel.js';

// Load environment variables
dotenv.config();

const app = express();
const SERVER_PORT = config.SERVER_PORT || 4000;
const BASE_URL = '/api/v1';

// Middleware
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

// Routes
app.use('/api/wallet', walletRoute);
app.use(`${BASE_URL}/customers`, customersRouter);
app.use(`${BASE_URL}/currency`, currencyRoutes);
app.use(`${BASE_URL}/transaction`, transactionRoute);
app.use(`${BASE_URL}/btc/address`, btcAddressRoutes);

// Error handling middleware
app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json(error.toJSON());
  }
  
  // Handle unexpected errors
  console.error('Unexpected error:', error);
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

const start = async () => {
  try {
    // Connect to Database
    await sequelize.authenticate();
    console.log('Connected to postgres DB');

    // Sync all table models
    await sequelize.sync({ alter: true });
    console.log("Models synchronized");

    // Start the server
    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port: ${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit with failure
  }
};

start();

