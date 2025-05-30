import dotenv from 'dotenv';

dotenv.config();

const config = {
  bitnob: {
    apiUrl: process.env.BITNOB_API_URL || 'https://sandboxapi.bitnob.co/api/v1',
    apiKey: process.env.BITNOB_API_KEY
  }
};

export default config; 