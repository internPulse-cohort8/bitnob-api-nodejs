// jest.mock('axios', () => ({
//   create: jest.fn(() => ({
//     get: jest.fn()
//   }))
// }));

// import { jest } from '@jest/globals';
// import axios from 'axios';
// import currencyService from '../src/services/currencyService.js';

// describe('CurrencyService', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('getCurrencyRate', () => {
//     it('should successfully get USD rate', async () => {
//       const mockResponse = {
//         status: 200,
//         data: {
//           status: true,
//           message: 'USD rate successfully retrieved',
//           data: {
//             currency: 'USD',
//             sellRate: 1,
//             buyRate: 1
//           }
//         }
//       };

//       const mockGet = jest.fn().mockResolvedValue(mockResponse);
//       axios.create = jest.fn(() => ({ get: mockGet }));

//       const result = await currencyService.getCurrencyRate('USD');

//       expect(result.success).toBe(true);
//       expect(result.data).toEqual(mockResponse.data);
//       expect(mockGet).toHaveBeenCalledWith('/wallets/payout/rate/USD');
//     });

//     it('should handle API errors gracefully', async () => {
//       const mockError = {
//         response: {
//           status: 401,
//           data: {
//             message: 'Unauthorized'
//           }
//         }
//       };

//       const mockGet = jest.fn().mockRejectedValue(mockError);
//       axios.create = jest.fn(() => ({ get: mockGet }));

//       const result = await currencyService.getCurrencyRate('USD');

//       expect(result.success).toBe(false);
//       expect(result.error).toBe('Unauthorized');
//     });
//   });

//   describe('getExchangeRates', () => {
//     it('should successfully get all exchange rates', async () => {
//       const mockResponse = {
//         status: 200,
//         data: {
//           status: true,
//           message: 'Rates retrieved successfully',
//           data: {
//             USD: { sellRate: 1, buyRate: 1 },
//             EUR: { sellRate: 0.92, buyRate: 0.94 }
//           }
//         }
//       };

//       const mockGet = jest.fn().mockResolvedValue(mockResponse);
//       axios.create = jest.fn(() => ({ get: mockGet }));

//       const result = await currencyService.getExchangeRates();

//       expect(result.success).toBe(true);
//       expect(result.data).toEqual(mockResponse.data);
//       expect(mockGet).toHaveBeenCalledWith('/wallets/payout/rates');
//     });
//   });

//   describe('convertCurrency', () => {
//     it('should successfully convert between currencies', async () => {
//       const mockRatesResponse = {
//         status: 200,
//         data: {
//           data: {
//             USD: { sellRate: 1, buyRate: 1 },
//             EUR: { sellRate: 0.92, buyRate: 0.94 }
//           }
//         }
//       };

//       const mockGet = jest.fn().mockResolvedValue(mockRatesResponse);
//       axios.create = jest.fn(() => ({ get: mockGet }));

//       const result = await currencyService.convertCurrency(100, 'USD', 'EUR');

//       expect(result.success).toBe(true);
//       expect(result.data).toHaveProperty('convertedAmount');
//       expect(result.data).toHaveProperty('rate');
//       expect(mockGet).toHaveBeenCalledWith('/wallets/payout/rates');
//     });

//     it('should handle unsupported currencies', async () => {
//       const mockRatesResponse = {
//         status: 200,
//         data: {
//           data: {
//             USD: { sellRate: 1, buyRate: 1 }
//           }
//         }
//       };

//       const mockGet = jest.fn().mockResolvedValue(mockRatesResponse);
//       axios.create = jest.fn(() => ({ get: mockGet }));

//       const result = await currencyService.convertCurrency(100, 'USD', 'XYZ');

//       expect(result.success).toBe(false);
//       expect(result.error).toBe('One or both currencies are not supported');
//     });
//   });
// }); 