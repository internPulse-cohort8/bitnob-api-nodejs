import { z } from 'zod';
import btcAddressService from '../services/btcAddressService.js';
import { StatusCodes } from 'http-status-codes';

// Validation schemas
const generateAddressSchema = z.object({
  user_id: z.string().uuid('Invalid user_id format'),
  address_type: z.enum(['legacy', 'segwit', 'native_segwit']).optional().default('native_segwit'),
  label: z.string().min(1).max(50).optional(),
  derivation_path: z.string().optional()
});

const multipleAddressSchema = z.object({
  user_id: z.string().uuid('Invalid user_id format'),
  count: z.number().int().min(1).max(10, 'Maximum 10 addresses can be generated at once'),
  address_type: z.enum(['legacy', 'segwit', 'native_segwit']).optional().default('native_segwit'),
  start_index: z.number().int().min(0).optional().default(0)
});

const validateAddressSchema = z.object({
  address: z.string().min(26).max(62, 'Invalid BTC address format')
});

const importAddressSchema = z.object({
  user_id: z.string().uuid('Invalid user_id format'),
  address: z.string().min(26).max(62, 'Invalid BTC address format'),
  private_key: z.string().optional(),
  label: z.string().min(1).max(50).optional(),
  watch_only: z.boolean().optional().default(false)
});

export const generateBtcAddress = async (req, res) => {
  try {
    const validationResult = generateAddressSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
    }

    const { user_id, address_type, label, derivation_path } = validationResult.data;
    
    const result = await btcAddressService.generateNewAddress({
      user_id,
      address_type,
      label,
      derivation_path
    });

    if (!result.success) {
      return res.status(StatusCodes.BAD_REQUEST).json(result);
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'BTC address generated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error generating BTC address:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const generateMultipleBtcAddresses = async (req, res) => {
  try {
    const validationResult = multipleAddressSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
    }

    const { user_id, count, address_type, start_index } = validationResult.data;
    
    const result = await btcAddressService.generateMultipleAddresses({
      user_id,
      count,
      address_type,
      start_index
    });

    if (!result.success) {
      return res.status(StatusCodes.BAD_REQUEST).json(result);
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: `${count} BTC addresses generated successfully`,
      data: result.data
    });
  } catch (error) {
    console.error('Error generating multiple BTC addresses:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const validateBtcAddress = async (req, res) => {
  try {
    const validationResult = validateAddressSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
    }

    const { address } = validationResult.data;
    
    const result = await btcAddressService.validateAddress(address);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error validating BTC address:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const getBtcAddressDetails = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || address.length < 26 || address.length > 62) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Invalid BTC address format'
      });
    }

    const result = await btcAddressService.getAddressDetails(address);

    if (!result.success) {
      return res.status(StatusCodes.NOT_FOUND).json(result);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error getting BTC address details:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const importBtcAddress = async (req, res) => {
  try {
    const validationResult = importAddressSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
    }

    const { user_id, address, private_key, label, watch_only } = validationResult.data;
    
    const result = await btcAddressService.importAddress({
      user_id,
      address,
      private_key,
      label,
      watch_only
    });

    if (!result.success) {
      return res.status(StatusCodes.BAD_REQUEST).json(result);
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'BTC address imported successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error importing BTC address:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const getBtcAddressBalance = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || address.length < 26 || address.length > 62) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Invalid BTC address format'
      });
    }

    const result = await btcAddressService.getAddressBalance(address);

    if (!result.success) {
      return res.status(StatusCodes.BAD_REQUEST).json(result);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error getting BTC address balance:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};