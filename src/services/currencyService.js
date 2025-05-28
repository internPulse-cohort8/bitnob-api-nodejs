import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BITNOB_API_URL = 'https://sandboxapi.bitnob.co/api/v1';
const API_KEY = process.env.BITNOB_API_KEY;

class CurrencyService {
  constructor() {
    this.client = axios.create({
      baseURL: BITNOB_API_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
  }

  async getCurrencyRate(currency) {
    try {
      // Log the request details for debugging
      console.log('Making request to Bitnob API with:', {
        currency,
        url: `${BITNOB_API_URL}/wallets/payout/rate/${currency}`,
        headers: {
          'Authorization': `Bearer ${API_KEY.substring(0, 10)}...`,
          'Content-Type': 'application/json'
        }
      });

      const response = await this.client.get(`/wallets/payout/rate/${currency}`);
      
      if (response.status >= 400) {
        console.error('Bitnob API Error Response:', response.data);
        return {
          success: false,
          error: response.data?.message || 'Failed to get currency rate'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Full Bitnob API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get currency rate'
      };
    }
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      // Log the request details for debugging
      console.log('Making request to Bitnob API with:', {
        amount,
        fromCurrency,
        toCurrency,
        url: `${BITNOB_API_URL}/wallets/payout/rates`,
        headers: {
          'Authorization': `Bearer ${API_KEY.substring(0, 10)}...`,
          'Content-Type': 'application/json'
        }
      });

      // Get all rates
      const ratesResponse = await this.client.get('/wallets/payout/rates');
      console.log('Rates Response:', ratesResponse.data);

      if (ratesResponse.status >= 400) {
        console.error('Bitnob API Error Response:', ratesResponse.data);
        return {
          success: false,
          error: ratesResponse.data?.message || 'Failed to get exchange rates'
        };
      }

      const rates = ratesResponse.data.data;
      
      // Get the rates for both currencies
      const fromRate = rates[fromCurrency.toUpperCase()];
      const toRate = rates[toCurrency.toUpperCase()];

      if (!fromRate || !toRate) {
        return {
          success: false,
          error: 'One or both currencies are not supported'
        };
      }

      // Convert to USD first (since all rates are relative to USD)
      const amountInUSD = amount / fromRate.sellRate;
      // Then convert from USD to target currency
      const convertedAmount = amountInUSD * toRate.buyRate;

      return {
        success: true,
        data: {
          amount: amount.toString(),
          from: fromCurrency.toUpperCase(),
          to: toCurrency.toUpperCase(),
          fromRate: fromRate.sellRate.toString(),
          toRate: toRate.buyRate.toString(),
          convertedAmount: convertedAmount.toString(),
          rate: (toRate.buyRate / fromRate.sellRate).toString()
        }
      };
    } catch (error) {
      console.error('Full Bitnob API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to convert currency'
      };
    }
  }

  async getExchangeRates() {
    try {
      const response = await this.client.get('/wallets/payout/rates');
      
      if (response.status >= 400) {
        console.error('Bitnob API Error Response:', response.data);
        return {
          success: false,
          error: response.data?.message || 'Failed to fetch exchange rates'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Full Bitnob API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch exchange rates'
      };
    }
  }
}

export default new CurrencyService(); 