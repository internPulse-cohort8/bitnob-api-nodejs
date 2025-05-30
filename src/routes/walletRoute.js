import express from 'express';
import { createWallet, getAllWallets, getWalletByCoin } from '../controllers/wallet.js';

const router = express.Router();

// Create wallet
router.post('/create', createWallet);

// List all wallets
router.get('/', getAllWallets);

// Get wallet by Coin
router.get('/coin/:coin', getWalletByCoin);

export default router;