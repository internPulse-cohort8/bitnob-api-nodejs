import express from 'express';
import dotenv from 'dotenv'
import { createWallet } from './controllers/wallet.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000

createWallet();
app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`)
})