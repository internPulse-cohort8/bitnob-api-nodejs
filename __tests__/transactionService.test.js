// import { jest } from '@jest/globals';
// import request from 'supertest';
// import express from 'express';
// import transactionRoutes from '../src/routes/transactionRoutes.js'; 


// jest.mock('../src/models/transaction.js', () => ({
//   __esModule: true,
//   default: {
//     create: jest.fn(),
//     findAll: jest.fn(),
//     findByPk: jest.fn(),
//   },
// }));

// const app = express();
// app.use(express.json());
// app.use('/api/transactions', transactionRoutes);

// describe('Transaction Routes', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('POST /api/transactions', () => {
//     it('should create a transaction successfully', async () => {
//       const mockTransaction = { id: 1, amount: 100, transaction: 'USD' };

//       transactionModel.create.mockResolvedValue(mockTransaction);

//       const response = await request(app)
//         .post('/api/transactions')
//         .send({ amount: 100, transaction: 'USD' })
//         .expect('Content-Type', /json/)
//         .expect(201);

//       expect(response.body).toEqual(mockTransaction);
//       expect(transactionModel.create).toHaveBeenCalledWith({ amount: 100, transaction: 'USD' });
//     });
//   });

//   describe('GET /api/transactions', () => {
//     it('should fetch all transactions', async () => {
//       const mockTransactions = [{ id: 1, amount: 100, transaction: 'USD' }];

//       transactionModel.findAll.mockResolvedValue(mockTransactions);

//       const response = await request(app)
//         .get('/api/transactions')
//         .expect('Content-Type', /json/)
//         .expect(200);

//       expect(response.body).toEqual(mockTransactions);
//       expect(transactionModel.findAll).toHaveBeenCalled();
//     });
//   });

//   describe('GET /api/transactions/:id', () => {
//     it('should return a transaction by id', async () => {
//       const mockTransaction = { id: 1, amount: 100, transaction: 'USD' };

//       transactionModel.findByPk.mockResolvedValue(mockTransaction);

//       const response = await request(app)
//         .get('/api/transactions/1')
//         .expect('Content-Type', /json/)
//         .expect(200);

//       expect(response.body).toEqual(mockTransaction);
//       expect(transactionModel.findByPk).toHaveBeenCalledWith('1');
//     });

//     it('should return 404 if transaction not found', async () => {
//       transactionModel.findByPk.mockResolvedValue(null);

//       const response = await request(app)
//         .get('/api/transactions/999')
//         .expect('Content-Type', /json/)
//         .expect(404);

//       expect(response.body).toEqual({ error: 'Transaction not found' });
//       expect(transactionModel.findByPk).toHaveBeenCalledWith('999');
//     });
//   });
// });
// transactions.test.js

import { jest } from '@jest/globals';


// Mock the entire service module
jest.mock(process.cwd() + '/src/controllers/transactionController.js', () => {
  const mockService = {
    createTransaction: jest.fn(),
    getTransactionById: jest.fn(),
   updateTransactionStatus: jest.fn(),
   getAllTransactions:jest.fn()

  
  };
  return {
    __esModule: true,
    default: mockService
  };
});

import transactionService from '../src/controllers/transactionController.js';

// Ensure the methods are Jest mocks
transactionService.createTransaction = jest.fn();
transactionService.getTransactionById = jest.fn();
transactionService.updateTransactionStatus = jest.fn();
transactionService.getAllTransactions = jest.fn();
