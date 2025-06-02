import { z } from 'zod';
import walletService from '../services/walletService.js';

const walletCreateSchema = z.object({
  coin: z.enum(['trx', 'bnb'])
});

export const createWallet = async (req, res) => {
  try {
    const validationResult = walletCreateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validationResult.error.errors
      });
    }

    const { coin } = req.body;
    const result = await walletService.createWallet(coin);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {  
      console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getAllWallets = async (req, res) => {
  try {
    const result = await walletService.getAllWallets();
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {    
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getWalletByCoin = async (req, res) => {
  try {
    const { coin } = req.params;
    const result = await walletService.getWalletByCoin(coin);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
        console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
