import express from 'express';
import { convertCurrency, getExchangeRates } from '../controllers/currencyController.js';
import currencyService from '../services/currencyService.js';

const router = express.Router();

// Convert currency
router.post('/convert', convertCurrency);

// Get exchange rates
router.get('/rates', getExchangeRates);

// Get specific currency rate
router.get('/rate/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    const result = await currencyService.getCurrencyRate(currency.toUpperCase());
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 