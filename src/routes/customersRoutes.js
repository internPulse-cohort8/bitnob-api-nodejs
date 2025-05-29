import express from 'express';
import { createCustomer, getCustomer, getCustomers } from '../controllers/customers/customers.ccontrollers.js';

const router = express.Router();

router.post('', createCustomer);
router.get('/:customerId', getCustomer);
router.get('', getCustomers);

export { router as customersRouter };