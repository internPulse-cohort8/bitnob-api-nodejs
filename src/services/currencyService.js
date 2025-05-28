import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BITNOB_API_URL = 'https://api.bitnob.co/api/v1';
const API_KEY = process.env.BITNOB_API_KEY;

class CurrencyService {
  constructor() {
    this.client = axios.create({
      baseURL: BITNOB_API_URL,
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      // Log the request details for debugging
      console.log('Making request to Bitnob API with:', {
        amount,
        fromCurrency,
        toCurrency,
        url: `${BITNOB_API_URL}/exchange/convert`,
        headers: {
          'Authorization': `${API_KEY.substring(0, 10)}...`,
          'Content-Type': 'application/json'
        }
      });

      // First try to get the current rates
      const ratesResponse = await this.client.get('/exchange/rates');
      console.log('Rates Response:', ratesResponse.data);

      // Then try the conversion
      const response = await this.client.post('/exchange/convert', {
        amount: amount.toString(),
        from: fromCurrency.toUpperCase(),
        to: toCurrency.toUpperCase()
      });

      if (response.status >= 400) {
        console.error('Bitnob API Error Response:', response.data);
        return {
          success: false,
          error: response.data?.message || 'Failed to convert currency'
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
      const response = await this.client.get('/exchange/rates');
      
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