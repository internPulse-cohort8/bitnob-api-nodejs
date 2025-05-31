import { z } from 'zod';
import transactionService from '../services/transactionService.js';

const transactionCreateSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(3).max(3),
  sender_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
  txn_type: z.enum(['deposit', 'withdrawal', 'transfer'])
});

const transactionUpdateSchema = z.object({
  txn_status: z.enum(['pending', 'completed', 'failed']),
  confirmed_at: z.date().optional()
});

export const createTransaction = async (req, res) => {
  try {
    const validationResult = transactionCreateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction data',
        details: validationResult.error.errors
      });
    }

    const result = await transactionService.createTransaction(req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const result = await transactionService.getAllTransactions();
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const result = await transactionService.getTransactionById(req.params.id);
    return res.status(result.success ? 200 : (result.status || 400)).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const validationResult = transactionUpdateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status data',
        details: validationResult.error.errors
      });
    }

    const result = await transactionService.updateTransactionStatus(
      req.params.id,
      req.body
    );
    return res.status(result.success ? 200 : (result.status || 400)).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};