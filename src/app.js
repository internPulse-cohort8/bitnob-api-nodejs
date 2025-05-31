import express from 'express';
import dotenv from 'dotenv';
import currencyRoutes from './routes/currencyRoutes.js';
import { transactionRoute } from './routes/transaction.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/currency', currencyRoutes);
app.use('/api/currency', transactionRoute);

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

export default app;
