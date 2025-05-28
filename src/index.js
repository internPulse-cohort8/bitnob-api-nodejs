import express from 'express';
import dotenv from 'dotenv'
import walletRoute from './routes/walletRoute.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000

app.use(express.json());

app.use('/api/wallet', walletRoute);


app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`)
})