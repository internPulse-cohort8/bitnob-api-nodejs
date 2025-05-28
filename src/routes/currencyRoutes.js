import express from 'express';
import { convertCurrency, getExchangeRates } from '../controllers/currencyController.js';

const router = express.Router();

// Convert currency
router.post('/convert', convertCurrency);

// Get exchange rates
router.get('/rates', getExchangeRates);

export default router; 