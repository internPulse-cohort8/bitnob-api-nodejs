import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import transactionRoutes from '../src/routes/transactionRoutes.js';
import * as transactionServiceModule from '../src/services/transactionService.js';

const mockedTransactionService = transactionServiceModule.default;

// Mock service methods
mockedTransactionService.createTransaction = jest.fn();
mockedTransactionService.getAllTransactions = jest.fn();
mockedTransactionService.getTransactionById = jest.fn();
mockedTransactionService.updateTransactionStatus = jest.fn();

let app;
let server;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/api/transactions', transactionRoutes);
  server = app.listen(0);
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe('Transaction Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction successfully', async () => {
      const validTransactionData = {
        amount: 100,
        currency: 'USD',
        sender_id: '123e4567-e89b-12d3-a456-426614174000',
        receiver_id: '123e4567-e89b-12d3-a456-426614174001',
        txn_type: 'transfer'
      };

      const mockResponse = {
        success: true,
        data: {
          ...validTransactionData,
          id: 1,
          txn_status: 'pending',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      };

      mockedTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/transactions')
        .send(validTransactionData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual(mockResponse);
      expect(mockedTransactionService.createTransaction).toHaveBeenCalledWith(validTransactionData);
    });

    it('should return 400 for invalid transaction data', async () => {
      const invalidTransactionData = {
        amount: 'not-a-number',
        currency: 'US',
        sender_id: 'invalid',
        txn_type: 'invalid-type'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(invalidTransactionData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(mockedTransactionService.createTransaction).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/transactions', () => {
    it('should fetch all transactions successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: 1, amount: 100, currency: 'USD' },
          { id: 2, amount: 200, currency: 'EUR' }
        ]
      };

      mockedTransactionService.getAllTransactions.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/transactions')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(mockedTransactionService.getAllTransactions).toHaveBeenCalled();
    });

    it('should return empty array when no transactions exist', async () => {
      const mockResponse = {
        success: true,
        data: []
      };

      mockedTransactionService.getAllTransactions.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/transactions')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/transactions/:id', () => {
    it('should fetch a single transaction by ID', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          amount: 100,
          currency: 'USD',
          txn_status: 'completed'
        }
      };

      mockedTransactionService.getTransactionById.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/transactions/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(mockedTransactionService.getTransactionById).toHaveBeenCalledWith('1');
    });

    it('should return 404 for non-existent transaction', async () => {
      const mockResponse = {
        success: false,
        error: 'Transaction not found',
        status: 404
      };

      mockedTransactionService.getTransactionById.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/transactions/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Transaction not found');
    });
  });

});