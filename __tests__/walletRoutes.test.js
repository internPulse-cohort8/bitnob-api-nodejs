import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import walletRoutes from '../src/routes/walletRoutes.js';
import * as walletServiceModule from '../src/services/walletService.js';

const mockedWalletService = walletServiceModule.default;


mockedWalletService.createWallet = jest.fn();
mockedWalletService.getAllWallets = jest.fn();
mockedWalletService.getWalletByCoin = jest.fn();

let app;
let server;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/api/wallets', walletRoutes);
  server = app.listen(0); // Use port 0 for random available port
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe('Wallet Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/wallets', () => {
    it('should create a new wallet successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'wallet_123',
          coin: 'trx',
          address: 'TXYZ1234567890',
          status: 'active'
        }
      };
      mockedWalletService.createWallet.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/wallets')
        .send({ coin: 'trx' })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual(mockResponse);
      expect(mockedWalletService.createWallet).toHaveBeenCalledWith('trx');
    });

  });

  describe('GET /api/wallets', () => {
    it('should fetch all wallets successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: 'wallet_1', coin: 'trx' },
          { id: 'wallet_2', coin: 'bnb' }
        ]
      };
      mockedWalletService.getAllWallets.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/wallets')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(mockedWalletService.getAllWallets).toHaveBeenCalled();
    });

    it('should handle empty wallet list', async () => {
      const mockResponse = {
        success: true,
        data: []
      };
      mockedWalletService.getAllWallets.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/wallets')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).toEqual([]);
    });
  });


});