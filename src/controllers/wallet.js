import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BITNOB_API_URL = 'https://sandboxapi.bitnob.co/api/v1';
const BITNOB_API_KEY = process.env.BITNOB_API_KEY;

// Debug logs for API key
console.log('API Key loaded:', BITNOB_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', BITNOB_API_KEY ? BITNOB_API_KEY.length : 0);
console.log('API Key format check:', BITNOB_API_KEY ? (BITNOB_API_KEY.startsWith('sk.') ? 'Correct format' : 'Incorrect format') : 'No key');

// Create a new wallet
export const createWallet = async (req, res) => {
    try {
        // Log the incoming request
        console.log('Incoming request headers:', req.headers);
        console.log('Incoming request body:', req.body);

        if (!req.body) {
            return res.status(400).json({
                status: false,
                message: 'Request body is required'
            });
        }

        const { coin } = req.body;
        
        if (!coin || !['trx', 'bnb'].includes(coin)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid coin type. Must be either "trx" or "bnb"'
            });
        }

        if (!BITNOB_API_KEY) {
            return res.status(500).json({
                status: false,
                message: 'API key is not configured'
            });
        }

        if (!BITNOB_API_KEY.startsWith('sk.')) {
            return res.status(500).json({
                status: false,
                message: 'Invalid API key format. Must start with "sk."'
            });
        }

        // Debug log to check request details
        console.log('Making request to:', `${BITNOB_API_URL}/wallets/create-new-crypto-wallet`);
        console.log('Request body:', { coin });
        console.log('Request headers:', {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${BITNOB_API_KEY.substring(0, 5)}...`
        });

        const response = await axios({
            method: 'POST',
            url: `${BITNOB_API_URL}/wallets/create-new-crypto-wallet`,
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${BITNOB_API_KEY.trim()}`
            },
            data: { coin }
        });

        console.log('Bitnob API response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: {
                    ...error.config?.headers,
                    Authorization: error.config?.headers?.Authorization ? 'Bearer sk...' : undefined
                }
            }
        });

        if (error.response) {
            // The request was made and the server responded with a status code
            return res.status(error.response.status).json({
                status: false,
                message: error.response.data?.message || 'API request failed',
                details: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            return res.status(500).json({
                status: false,
                message: 'No response received from Bitnob API'
            });
        } else {
            // Something happened in setting up the request
            return res.status(500).json({
                status: false,
                message: error.message || 'Error setting up the request'
            });
        }
    }
};

// Get all wallets
export const getAllWallets = async (req, res) => {
    try {
        if (!BITNOB_API_KEY) {
            return res.status(500).json({
                status: false,
                message: 'API key is not configured'
            });
        }

        const response = await axios({
            method: 'GET',
            url: `${BITNOB_API_URL}/wallets`,
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${BITNOB_API_KEY.trim()}`
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching wallets:', error.message);
        
        if (error.response) {
            return res.status(error.response.status).json({
                status: false,
                message: error.response.data?.message || 'Failed to fetch wallets',
                details: error.response.data
            });
        }
        
        return res.status(500).json({
            status: false,
            message: 'Error fetching wallets'
        });
    }
};

// Get wallet by coin
export const getWalletByCoin = async (req, res) => {
    try {
        const { coin } = req.params;

        if (!coin || !['trx', 'bnb'].includes(coin)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid coin type. Must be either "trx" or "bnb"'
            });
        }

        if (!BITNOB_API_KEY) {
            return res.status(500).json({
                status: false,
                message: 'API key is not configured'
            });
        }

        const response = await axios({
            method: 'GET',
            url: `${BITNOB_API_URL}/wallets/crypto-wallet/${coin}`,
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${BITNOB_API_KEY.trim()}`
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching wallet:', error.message);
        
        if (error.response) {
            return res.status(error.response.status).json({
                status: false,
                message: error.response.data?.message || 'Failed to fetch wallet',
                details: error.response.data
            });
        }
        
        return res.status(500).json({
            status: false,
            message: 'Error fetching wallet'
        });
    }
};

