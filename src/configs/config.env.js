import dotenv from 'dotenv';
dotenv.config();

class Config {
  constructor() {
    this.SERVER_PORT = process.env.SERVER_PORT || 4000;
  }
}

export const config = new Config();