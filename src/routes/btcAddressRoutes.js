import express from 'express';
import {
  generateBtcAddress,
  validateBtcAddress,
  getBtcAddressDetails,
  generateMultipleBtcAddresses,
  importBtcAddress,
  getBtcAddressBalance
} from '../controllers/btcAddressController.js';
import { validateBtcAddressRequest, validateMultipleAddressRequest } from '../middleware/btcValidationMiddleware.js';

const router = express.Router();

// Generate a new BTC address
router.post('/generate', validateBtcAddressRequest, generateBtcAddress);

// Generate multiple BTC addresses
router.post('/generate-multiple', validateMultipleAddressRequest, generateMultipleBtcAddresses);

// Validate a BTC address
router.post('/validate', validateBtcAddress);

// Get BTC address details
router.get('/details/:address', getBtcAddressDetails);

// Import existing BTC address
router.post('/import', importBtcAddress);

// Get BTC address balance
router.get('/balance/:address', getBtcAddressBalance);

export default router;