import express, { urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
//import { createWallet } from './controllers/wallet.js';
import { config } from './configs/config.env.js';

const app = express();

const SERVER_PORT = config.SERVER_PORT || 4000;

app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: config.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(compression());
app.use(json({ limit: '200mb' }));
app.use(urlencoded({ extended: true, limit: '200mb' }));

//  createWallet(); // Example usage of createWallet function


import walletRoutes from './controllers/wallet.js';

app.use('/wallet', walletRoutes);


if (process.env.NODE_ENV !== 'test') {
  app.listen(SERVER_PORT, () => {
    console.log(`Server running on port: ${SERVER_PORT}`);
  });
}

// Export app so Supertest can use it
export default app;