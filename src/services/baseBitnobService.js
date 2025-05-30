import axios from 'axios';
import config from '../config/index.js';

class BaseBitnobService {
  constructor() {
    this.client = axios.create({
      baseURL: config.bitnob.apiUrl,
      headers: {
        'Authorization': `Bearer ${config.bitnob.apiKey}`,
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
  }

  logRequest(endpoint, params = {}) {
    console.log('Making request to Bitnob API with:', {
      ...params,
      url: `${config.bitnob.apiUrl}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${config.bitnob.apiKey.substring(0, 10)}...`,
        'Content-Type': 'application/json'
      }
    });
  }

  logError(error) {
    console.error('Full Bitnob API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
  }
}

export default BaseBitnobService; 