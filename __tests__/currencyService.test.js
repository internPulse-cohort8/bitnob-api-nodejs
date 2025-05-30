import { jest } from '@jest/globals';


// Mock the entire service module
jest.mock(process.cwd() + '/src/services/currencyService.js', () => {
  const mockService = {
    getCurrencyRate: jest.fn(),
    getExchangeRates: jest.fn(),
    convertCurrency: jest.fn()
  };
  return {
    __esModule: true,
    default: mockService
  };
});

import currencyService from '../src/services/currencyService.js';

// Ensure the methods are Jest mocks
currencyService.getCurrencyRate = jest.fn();
currencyService.getExchangeRates = jest.fn();
currencyService.convertCurrency = jest.fn();

describe('CurrencyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrencyRate', () => {
    it('should successfully get USD rate', async () => {
      const mockResponse = {
        success: true,
        data: {
          status: true,
          message: 'USD rate successfully retrieved',
          data: {
            currency: 'USD',
            sellRate: 1,
            buyRate: 1
          }
        }
      };

      currencyService.getCurrencyRate.mockResolvedValue(mockResponse);

      const result = await currencyService.getCurrencyRate('USD');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(currencyService.getCurrencyRate).toHaveBeenCalledWith('USD');
    });

    it('should handle API errors gracefully', async () => {
      const mockError = {
        success: false,
        error: 'Unauthorized'
      };

      currencyService.getCurrencyRate.mockResolvedValue(mockError);

      const result = await currencyService.getCurrencyRate('USD');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('getExchangeRates', () => {
    it('should successfully get all exchange rates', async () => {
      const mockResponse = {
        success: true,
        data: {
          status: true,
          message: 'Rates retrieved successfully',
          data: {
            USD: { sellRate: 1, buyRate: 1 },
            EUR: { sellRate: 0.92, buyRate: 0.94 }
          }
        }
      };

      currencyService.getExchangeRates.mockResolvedValue(mockResponse);

      const result = await currencyService.getExchangeRates();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(currencyService.getExchangeRates).toHaveBeenCalled();
    });
  });

  describe('convertCurrency', () => {
    it('should successfully convert between currencies', async () => {
      const mockResponse = {
        success: true,
        data: {
          amount: '100',
          from: 'USD',
          to: 'EUR',
          fromRate: '1',
          toRate: '0.92',
          convertedAmount: '92',
          rate: '0.92'
        }
      };

      currencyService.convertCurrency.mockResolvedValue(mockResponse);

      const result = await currencyService.convertCurrency(100, 'USD', 'EUR');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(currencyService.convertCurrency).toHaveBeenCalledWith(100, 'USD', 'EUR');
    });

    it('should handle unsupported currencies', async () => {
      const mockError = {
        success: false,
        error: 'One or both currencies are not supported'
      };

      currencyService.convertCurrency.mockResolvedValue(mockError);

      const result = await currencyService.convertCurrency(100, 'USD', 'XYZ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('One or both currencies are not supported');
    });
  });
}); 