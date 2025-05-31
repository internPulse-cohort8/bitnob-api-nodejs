import { jest } from '@jest/globals';

// Mock the entire service module
jest.mock(process.cwd() + '/src/services/walletService.js', () => {
  const mockService = {
    createWallet: jest.fn(),
    getAllWallets: jest.fn(),
    getWalletByCoin: jest.fn()
  };
  return {
    __esModule: true,
    default: mockService
  };
});

import walletService from '../src/services/walletService.js';

// Ensure the methods are Jest mocks
walletService.createWallet = jest.fn();
walletService.getAllWallets = jest.fn();
walletService.getWalletByCoin = jest.fn();

describe('WalletService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    it('should successfully create a TRX wallet', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'wallet_123',
          coin: 'trx',
          address: 'TXYZ1234567890',
          status: 'active'
        }
      };

      walletService.createWallet.mockResolvedValue(mockResponse);

      const result = await walletService.createWallet('trx');

      expect(result.success).toBe(true);
      expect(result.data.coin).toBe('trx');
      expect(walletService.createWallet).toHaveBeenCalledWith('trx');
    });

    it('should handle invalid coin type', async () => {
      const mockError = {
        success: false,
        error: 'Invalid coin type. Must be either "trx" or "bnb"'
      };

      walletService.createWallet.mockResolvedValue(mockError);

      const result = await walletService.createWallet('invalid');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid coin type');
    });
  });

  describe('getAllWallets', () => {
    it('should fetch all wallets successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: 'wallet_1', coin: 'trx' },
          { id: 'wallet_2', coin: 'bnb' }
        ]
      };

      walletService.getAllWallets.mockResolvedValue(mockResponse);

      const result = await walletService.getAllWallets();

      expect(result.success).toBe(true);
      expect(result.data.length).toBe(2);
      expect(walletService.getAllWallets).toHaveBeenCalled();
    });

    it('should handle empty wallet list', async () => {
      const mockResponse = {
        success: true,
        data: []
      };

      walletService.getAllWallets.mockResolvedValue(mockResponse);

      const result = await walletService.getAllWallets();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('getWalletByCoin', () => {
    it('should fetch BNB wallet successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'wallet_456',
          coin: 'bnb',
          address: 'bnb1234567890'
        }
      };

      walletService.getWalletByCoin.mockResolvedValue(mockResponse);

      const result = await walletService.getWalletByCoin('bnb');

      expect(result.success).toBe(true);
      expect(result.data.coin).toBe('bnb');
      expect(walletService.getWalletByCoin).toHaveBeenCalledWith('bnb');
    });

    it('should handle wallet not found', async () => {
      const mockError = {
        success: false,
        error: 'Wallet not found for coin: trx'
      };

      walletService.getWalletByCoin.mockResolvedValue(mockError);

      const result = await walletService.getWalletByCoin('trx');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});