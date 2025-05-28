import express from 'express';
import { createWallet } from './controllers/wallet.js';
import { config } from './configs/config.env.js';

const app = express();
const SERVER_PORT = config.SERVER_PORT;

createWallet();
app.listen(SERVER_PORT, ()=> {
    console.log(`Server running on port: ${SERVER_PORT}`)
})