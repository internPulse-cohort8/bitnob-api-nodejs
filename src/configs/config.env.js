import dotenv from 'dotenv';
dotenv.config();

class Config {
  constructor() {
    this.SERVER_PORT = process.env.SERVER_PORT || 4000;
    this.BITNOB_API_KEY = process.env.BITNOB_API_KEY || '';
    this.BITNOB_API_URL = process.env.BITNOB_API_URL || 'https://api.bitnob.com/v1';
  }
}

export const config = new Config();