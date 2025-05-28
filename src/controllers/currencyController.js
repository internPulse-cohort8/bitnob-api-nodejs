import { z } from 'zod';
import currencyService from '../services/currencyService.js';

const conversionSchema = z.object({
  amount: z.number().positive(),
  fromCurrency: z.string().min(3).max(3),
  toCurrency: z.string().min(3).max(3)
});

export const convertCurrency = async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;

    // Validate input
    const validationResult = conversionSchema.safeParse({
      amount: Number(amount),
      fromCurrency,
      toCurrency
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input parameters',
        details: validationResult.error.errors
      });
    }

    const result = await currencyService.convertCurrency(
      Number(amount),
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase()
    );

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
};

export const getExchangeRates = async (req, res) => {
  try {
    const result = await currencyService.getExchangeRates();

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
}; 