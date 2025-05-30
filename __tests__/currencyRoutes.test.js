jest.mock(process.cwd() + '/src/services/currencyService.js', () => ({
  __esModule: true,
  default: {
    getCurrencyRate: jest.fn(),
    getExchangeRates: jest.fn(),
    convertCurrency: jest.fn()
  }
}));

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import currencyRoutes from '../src/routes/currencyRoutes.js';
import * as currencyServiceModule from '../src/services/currencyService.js';

const mockedCurrencyService = currencyServiceModule.default;

// Ensure the functions are Jest mocks
mockedCurrencyService.getCurrencyRate = jest.fn();
mockedCurrencyService.getExchangeRates = jest.fn();
mockedCurrencyService.convertCurrency = jest.fn();

let app;
let server;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/api/currency', currencyRoutes);
  server = app.listen(0); // Use port 0 for random available port
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe('Currency Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/currency/rate/:currency', () => {
    it('should return currency rate for valid currency', async () => {
      const mockResponse = {
        success: true,
        data: {
          currency: 'USD',
          sellRate: 1,
          buyRate: 1
        }
      };
      mockedCurrencyService.getCurrencyRate.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/currency/rate/USD')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(mockedCurrencyService.getCurrencyRate).toHaveBeenCalledWith('USD');
    });

    it('should handle errors gracefully', async () => {
      const mockError = {
        success: false,
        error: 'Unauthorized'
      };
      mockedCurrencyService.getCurrencyRate.mockResolvedValue(mockError);

      const response = await request(app)
        .get('/api/currency/rate/USD')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual(mockError);
    });
  });

  describe('GET /api/currency/rates', () => {
    it('should return all exchange rates', async () => {
      const mockResponse = {
        success: true,
        data: {
          USD: { sellRate: 1, buyRate: 1 },
          EUR: { sellRate: 0.92, buyRate: 0.94 }
        }
      };
      mockedCurrencyService.getExchangeRates.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/currency/rates')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(mockedCurrencyService.getExchangeRates).toHaveBeenCalled();
    });
  });

  describe('POST /api/currency/convert', () => {
    it('should convert currency successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          convertedAmount: 92,
          rate: 0.92
        }
      };
      mockedCurrencyService.convertCurrency.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 100,
          fromCurrency: 'USD',
          toCurrency: 'EUR'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(mockedCurrencyService.convertCurrency).toHaveBeenCalledWith(100, 'USD', 'EUR');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 100
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(mockedCurrencyService.convertCurrency).not.toHaveBeenCalled();
    });
  });
}); 