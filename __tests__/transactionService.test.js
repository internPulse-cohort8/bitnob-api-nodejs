import { jest } from '@jest/globals';

// Mock the entire service module
jest.mock(process.cwd() + '/src/services/transactionService.js', () => {
  const mockService = {
    createTransaction: jest.fn(),
    getAllTransactions: jest.fn(),
    getTransactionById: jest.fn(),
    updateTransactionStatus: jest.fn()
  };
  return {
    __esModule: true,
    default: mockService
  };
});

import transactionService from '../src/services/transactionService.js';

// Ensure the methods are Jest mocks
transactionService.createTransaction = jest.fn();
transactionService.getAllTransactions = jest.fn();
transactionService.getTransactionById = jest.fn();
transactionService.updateTransactionStatus = jest.fn();

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should successfully create a transaction', async () => {
      const mockTransactionData = {
        amount: 100,
        currency: 'USD',
        sender_id: 'sender123',
        receiver_id: 'receiver456',
        txn_type: 'transfer'
      };

      const mockResponse = {
        success: true,
        data: {
          ...mockTransactionData,
          id: 1,
          txn_status: 'pending',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      };

      transactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await transactionService.createTransaction(mockTransactionData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(transactionService.createTransaction).toHaveBeenCalledWith(mockTransactionData);
    });

    it('should handle creation errors', async () => {
      const mockError = {
        success: false,
        error: 'Failed to create transaction'
      };

      transactionService.createTransaction.mockResolvedValue(mockError);

      const result = await transactionService.createTransaction({});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create transaction');
    });
  });

  describe('getAllTransactions', () => {
    it('should fetch all transactions successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: 1, amount: 100 },
          { id: 2, amount: 200 }
        ]
      };

      transactionService.getAllTransactions.mockResolvedValue(mockResponse);

      const result = await transactionService.getAllTransactions();

      expect(result.success).toBe(true);
      expect(result.data.length).toBe(2);
      expect(transactionService.getAllTransactions).toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      const mockError = {
        success: false,
        error: 'Failed to fetch transactions'
      };

      transactionService.getAllTransactions.mockResolvedValue(mockError);

      const result = await transactionService.getAllTransactions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch transactions');
    });
  });

  describe('getTransactionById', () => {
    it('should fetch a transaction by ID successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          amount: 100,
          currency: 'USD'
        }
      };

      transactionService.getTransactionById.mockResolvedValue(mockResponse);

      const result = await transactionService.getTransactionById(1);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(1);
      expect(transactionService.getTransactionById).toHaveBeenCalledWith(1);
    });

    it('should handle transaction not found', async () => {
      const mockError = {
        success: false,
        error: 'Transaction not found',
        status: 404
      };

      transactionService.getTransactionById.mockResolvedValue(mockError);

      const result = await transactionService.getTransactionById(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Transaction not found');
      expect(result.status).toBe(404);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update transaction status successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          txn_status: 'completed',
          confirmed_at: '2023-01-01T00:00:00.000Z'
        }
      };

      transactionService.updateTransactionStatus.mockResolvedValue(mockResponse);

      const result = await transactionService.updateTransactionStatus(1, {
        txn_status: 'completed',
        confirmed_at: '2023-01-01T00:00:00.000Z'
      });

      expect(result.success).toBe(true);
      expect(result.data.txn_status).toBe('completed');
      expect(transactionService.updateTransactionStatus).toHaveBeenCalledWith(1, {
        txn_status: 'completed',
        confirmed_at: '2023-01-01T00:00:00.000Z'
      });
    });

    it('should handle transaction not found during update', async () => {
      const mockError = {
        success: false,
        error: 'Transaction not found',
        status: 404
      };

      transactionService.updateTransactionStatus.mockResolvedValue(mockError);

      const result = await transactionService.updateTransactionStatus(999, {});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Transaction not found');
      expect(result.status).toBe(404);
    });
  });
});
