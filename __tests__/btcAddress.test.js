jest.mock(process.cwd() + '/src/services/btcAddressService.js', () => ({
  __esModule: true,
  default: {
    generateNewAddress: jest.fn(),
    generateMultipleAddresses: jest.fn(),
    validateAddress: jest.fn(),
    getAddressDetails: jest.fn(),
    importAddress: jest.fn(),
    getAddressBalance: jest.fn()
  }
}));

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import btcAddressRoutes from '../src/routes/btcAddressRoutes.js';
import * as btcAddressServiceModule from '../src/services/btcAddressService.js';

const mockedBtcAddressService = btcAddressServiceModule.default;

// Ensure the functions are Jest mocks
mockedBtcAddressService.generateNewAddress = jest.fn();
mockedBtcAddressService.generateMultipleAddresses = jest.fn();
mockedBtcAddressService.validateAddress = jest.fn();
mockedBtcAddressService.getAddressDetails = jest.fn();
mockedBtcAddressService.importAddress = jest.fn();
mockedBtcAddressService.getAddressBalance = jest.fn();

let app;
let server;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/api/btc/address', btcAddressRoutes);
  server = app.listen(0); // Use port 0 for random available port
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe('BTC Address Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/btc/address/generate', () => {
    const validGenerateRequest = {
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      address_type: 'native_segwit',
      label: 'My BTC Address'
    };

    it('should generate a new BTC address successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          address_id: '550e8400-e29b-41d4-a716-446655440001',
          address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
          address_type: 'native_segwit',
          public_key: '0279be667ef9dcbbac55a06295ce870...',
          derivation_path: "m/84'/0'/0'/0/0",
          label: 'My BTC Address',
          qr_code: 'bitcoin:bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
        }
      };

      mockedBtcAddressService.generateNewAddress.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/btc/address/generate')
        .send(validGenerateRequest)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResponse.data);
      expect(response.body.message).toBe('BTC address generated successfully');
      expect(mockedBtcAddressService.generateNewAddress).toHaveBeenCalledWith(validGenerateRequest);
    });

    it('should validate required fields', async () => {
      const invalidRequest = {
        address_type: 'native_segwit'
        // Missing user_id
      };

      const response = await request(app)
        .post('/api/btc/address/generate')
        .send(invalidRequest)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'user_id',
            message: expect.stringContaining('Required')
          })
        ])
      );
      expect(mockedBtcAddressService.generateNewAddress).not.toHaveBeenCalled();
    });

    it('should validate user_id format', async () => {
      const invalidRequest = {
        user_id: 'invalid-uuid',
        address_type: 'native_segwit'
      };

      const response = await request(app)
        .post('/api/btc/address/generate')
        .send(invalidRequest)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(mockedBtcAddressService.generateNewAddress).not.toHaveBeenCalled();
    });

    it('should validate address_type enum', async () => {
      const invalidRequest = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        address_type: 'invalid_type'
      };

      const response = await request(app)
        .post('/api/btc/address/generate')
        .send(invalidRequest)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(mockedBtcAddressService.generateNewAddress).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const mockError = {
        success: false,
        error: 'Failed to generate BTC address',
        message: 'Database connection error'
      };

      mockedBtcAddressService.generateNewAddress.mockResolvedValue(mockError);

      const response = await request(app)
        .post('/api/btc/address/generate')
        .send(validGenerateRequest)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual(mockError);
    });
  });

  describe('POST /api/btc/address/generate-multiple', () => {
    const validMultipleRequest = {
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      count: 5,
      address_type: 'native_segwit',
      start_index: 0
    };

    it('should generate multiple BTC addresses successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          addresses: [
            {
              address_id: '550e8400-e29b-41d4-a716-446655440001',
              address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
              address_type: 'native_segwit',
              derivation_path: "m/84'/0'/0'/0/0",
              index: 0
            },
            {
              address_id: '550e8400-e29b-41d4-a716-446655440002',
              address: 'bc1qxvk58dkl4u7e8r2fy3q5e8s7k2z7t2m9l6g4n8',
              address_type: 'native_segwit',
              derivation_path: "m/84'/0'/0'/0/1",
              index: 1
            }
          ],
          count: 5,
          mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
        }
      };

      mockedBtcAddressService.generateMultipleAddresses.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/btc/address/generate-multiple')
        .send(validMultipleRequest)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResponse.data);
      expect(response.body.message).toBe('5 BTC addresses generated successfully');
      expect(mockedBtcAddressService.generateMultipleAddresses).toHaveBeenCalledWith(validMultipleRequest);
    });

    it('should validate count limits', async () => {
      const invalidRequest = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        count: 15 // Exceeds maximum of 10
      };

      const response = await request(app)
        .post('/api/btc/address/generate-multiple')
        .send(invalidRequest)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(mockedBtcAddressService.generateMultipleAddresses).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/btc/address/validate', () => {
    it('should validate a BTC address successfully', async () => {
      const validRequest = {
        address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
      };

      const mockResponse = {
        address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        is_valid: true,
        address_type: 'native_segwit',
        network: 'mainnet'
      };

      mockedBtcAddressService.validateAddress.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/btc/address/validate')
        .send(validRequest)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResponse);
      expect(mockedBtcAddressService.validateAddress).toHaveBeenCalledWith(validRequest.address);
    });

    it('should handle invalid address format', async () => {
      const invalidRequest = {
        address: 'invalid-address'
      };

      const response = await request(app)
        .post('/api/btc/address/validate')
        .send(invalidRequest)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(mockedBtcAddressService.validateAddress).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/btc/address/details/:address', () => {
    const validAddress = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';

    it('should get address details successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          address_id: '550e8400-e29b-41d4-a716-446655440001',
          address: validAddress,
          address_type: 'native_segwit',
          balance: 0.00123456,
          label: 'My BTC Address',
          derivation_path: "m/84'/0'/0'/0/0",
          is_used: false,
          is_change: false,
          created_at: '2024-01-01T00:00:00.000Z',
          wallet_info: {
            wallet_id: '550e8400-e29b-41d4-a716-446655440000',
            wallet_status: 'isActive'
          }
        }
      };

      mockedBtcAddressService.getAddressDetails.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get(`/api/btc/address/details/${validAddress}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResponse.data);
      expect(mockedBtcAddressService.getAddressDetails).toHaveBeenCalledWith(validAddress);
    });

    it('should handle address not found', async () => {
      const mockError = {
        success: false,
        error: 'Address not found',
        message: 'The specified BTC address was not found in the database'
      };

      mockedBtcAddressService.getAddressDetails.mockResolvedValue(mockError);

      const response = await request(app)
        .get(`/api/btc/address/details/${validAddress}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual(mockError);
    });

    it('should validate address format in URL parameter', async () => {
      const invalidAddress = 'invalid-address';

      const response = await request(app)
        .get(`/api/btc/address/details/${invalidAddress}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid BTC address format');
      expect(mockedBtcAddressService.getAddressDetails).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/btc/address/import', () => {
    const validImportRequest = {
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
      label: 'Imported Address',
      watch_only: true
    };

    it('should import BTC address successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          address_id: '550e8400-e29b-41d4-a716-446655440001',
          address: validImportRequest.address,
          address_type: 'native_segwit',
          label: 'Imported Address',
          watch_only: true,
          imported: true
        }
      };

      mockedBtcAddressService.importAddress.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/btc/address/import')
        .send(validImportRequest)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResponse.data);
      expect(response.body.message).toBe('BTC address imported successfully');
      expect(mockedBtcAddressService.importAddress).toHaveBeenCalledWith(validImportRequest);
    });
  });

  describe('GET /api/btc/address/balance/:address', () => {
    const validAddress = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';

    it('should get address balance successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          address: validAddress,
          balance: 0.00123456,
          confirmed_balance: 0.00123456,
          unconfirmed_balance: 0,
          source: 'bitnob'
        }
      };

      mockedBtcAddressService.getAddressBalance.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get(`/api/btc/address/balance/${validAddress}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResponse.data);
      expect(mockedBtcAddressService.getAddressBalance).toHaveBeenCalledWith(validAddress);
    });

    it('should handle balance fetch errors', async () => {
      const mockError = {
        success: false,
        error: 'Failed to get address balance',
        message: 'API service unavailable'
      };

      mockedBtcAddressService.getAddressBalance.mockResolvedValue(mockError);

      const response = await request(app)
        .get(`/api/btc/address/balance/${validAddress}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual(mockError);
    });
  });
});