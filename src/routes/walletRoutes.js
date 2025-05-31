import express from 'express';
import {
  createWallet,
  getAllWallets,
  getWalletByCoin
} from '../controllers/walletController.js';

const router = express.Router();

router.post('/', createWallet);
router.get('/', getAllWallets);
router.get('/:coin', getWalletByCoin);

export default router;