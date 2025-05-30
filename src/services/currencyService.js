import BaseBitnobService from './baseBitnobService.js';

class CurrencyService extends BaseBitnobService {
  async getCurrencyRate(currency) {
    try {
      this.logRequest(`/wallets/payout/rate/${currency}`, { currency });

      const response = await this.client.get(`/wallets/payout/rate/${currency}`);
      
      if (response.status >= 400) {
        this.logError(response);
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
      this.logError(error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get currency rate'
      };
    }
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      this.logRequest('/wallets/payout/rates', { amount, fromCurrency, toCurrency });

      // Get all rates
      const ratesResponse = await this.client.get('/wallets/payout/rates');
      console.log('Rates Response:', ratesResponse.data);

      if (ratesResponse.status >= 400) {
        this.logError(ratesResponse);
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
      this.logError(error);
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
        this.logError(response);
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
      this.logError(error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch exchange rates'
      };
    }
  }
}

export default new CurrencyService(); 