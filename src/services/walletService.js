import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BITNOB_API_URL = process.env.BITNOB_API_URL || 'https://sandboxapi.bitnob.co/api/v1';
const BITNOB_API_KEY = process.env.BITNOB_API_KEY;

class WalletService {
  constructor() {
    this.client = axios.create({
      baseURL: BITNOB_API_URL,
      headers: {
        'Authorization': `Bearer ${BITNOB_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async createWallet(coin) {
    try {
      if (!['trx', 'bnb'].includes(coin)) {
        return {
          success: false,
          error: 'Invalid coin type. Must be either "trx" or "bnb"'
        };
      }

      const response = await this.client.post('/wallets/create-new-crypto-wallet', { coin });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create wallet'
      };
    }
  }

  async getAllWallets() {
    try {
      const response = await this.client.get('/wallets');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch wallets'
      };
    }
  }

  async getWalletByCoin(coin) {
    try {
      if (!['trx', 'bnb'].includes(coin)) {
        return {
          success: false,
          error: 'Invalid coin type. Must be either "trx" or "bnb"'
        };
      }

      const response = await this.client.get(`/wallets/crypto-wallet/${coin}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch wallet'
      };
    }
  }
}

export default new WalletService();