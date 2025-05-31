import Router from 'express';
import { generateAddress, sendBitcoin } from '../controllers/customers/sendBitcoin.js';
const router = Router();

router.post('/address', generateAddress);

router.post('/create', sendBitcoin);

export {router as transactionRoute}
