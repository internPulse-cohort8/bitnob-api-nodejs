import express from 'express';
import { createWallet } from '../controllers/wallet.js';

const router = express.Router();

router.post('/create', createWallet);

export default router;