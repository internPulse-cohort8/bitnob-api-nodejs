import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionStatus
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.patch('/:id/status', updateTransactionStatus);

export default router;