import { AxiosService } from "../../services/axios/AxiosService.js";

const BITNOB_BASE_URL = process.env.BITNOB_BASE_URL
const BITNOB_API_KEY = process.env.BITNOB_SANDBOX_API_URL;

const bitnobClient = new AxiosService(BITNOB_BASE_URL, BITNOB_API_KEY);

// generate address
export const generateAddress = async (req, res) => {
    try {
        const { label = 'purchase xbox', customerEmail, formatType = 'bip21', amount = '' } = req.body;

        if (!customerEmail) {
            return res.status(400).json({ status: false, message: 'customerEmail is required' });
        };

        const addressData = { label, customerEmail, formatType, amount };
        const response = await bitnobClient.post('/addresses/generate', addressData);

        console.log("response data:", response.data);
        console.log('Full response.data:', JSON.stringify(response.data, null, 2));

        const { data } = response;
        if (data.status) {
            return res.status(200).json({
                status: true,
                message: 'Address successfully generated',
                data: response.data.data,
            });
        } else {
            return res.status(500).json({ status: false, message: 'Failed to generate address' });
        };
    } catch (error) {
        console.error('Generate address error:', error.response?.data || error.message);
        return res.status(500).json({ status: false, message: 'Failed to generate address' });
    };
};

// Send bitcoin onchain
export const sendBitcoin = async (req, res) => {
    try {
        const { satoshis, address, customerEmail, description = '', priorityLevel = 'regular' } = req.body;

        if (!satoshis || !address || !customerEmail) {
            return res.status(400).json({ status: false, message: 'satoshis, address, and customerEmail are required' });
        }

        const paymentData = { satoshis, address, customerEmail, description, priorityLevel };
        const response = await bitnobClient.post('/wallets/send_bitcoin', paymentData);

        const { data } = response;
        if (data.status === true) {
            console.log('sending bitcoin successful', data.data);
            
            return res.status(200).json({
                status: true,
                message: 'Address successfully generated',
                data: data
            });
        } else {
             console.error('Send bitcoin error:', error.response?.data || error.message);
            return res.status(400).json({
                status: false,
                message: 'Failed to send bitcoin',
                data: error.response?.data || error.message
            });
        };

    } catch (error) {
        console.error('Send bitcoin error:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Internal Server Error', error});
    };
};
