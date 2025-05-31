import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';

// Custom BTC address validation function
const isBtcAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  
  // Basic length check
  if (address.length < 26 || address.length > 62) return false;
  
  // Check address prefixes
  const validPrefixes = ['1', '3', 'bc1', 'tb1'];
  const hasValidPrefix = validPrefixes.some(prefix => address.startsWith(prefix));
  
  return hasValidPrefix;
};

// Validation schemas
const btcAddressRequestSchema = z.object({
  user_id: z.string().uuid('Invalid user_id format'),
  address_type: z.enum(['legacy', 'segwit', 'native_segwit']).optional().default('native_segwit'),
  label: z.string().min(1).max(50).optional(),
  derivation_path: z.string().regex(/^m\/\d+'\/\d+'\/\d+'\/\d+\/\d+$/).optional()
});

const multipleAddressRequestSchema = z.object({
  user_id: z.string().uuid('Invalid user_id format'),
  count: z.number().int().min(1).max(10, 'Maximum 10 addresses can be generated at once'),
  address_type: z.enum(['legacy', 'segwit', 'native_segwit']).optional().default('native_segwit'),
  start_index: z.number().int().min(0).max(1000000).optional().default(0)
});

export const validateBtcAddressRequest = (req, res, next) => {
  try {
    const validationResult = btcAddressRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      });
    }
    
    // Add validated data to request
    req.validatedData = validationResult.data;
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Validation error',
      message: error.message
    });
  }
};

export const validateMultipleAddressRequest = (req, res, next) => {
  try {
    const validationResult = multipleAddressRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      });
    }
    
    req.validatedData = validationResult.data;
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Validation error',
      message: error.message
    });
  }
};

export const validateBtcAddress = (req, res, next) => {
  try {
    const { address } = req.body;
    
    if (!isBtcAddress(address)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Invalid BTC address format',
        message: 'The provided address is not a valid Bitcoin address'
      });
    }
    
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Address validation error',
      message: error.message
    });
  }
};

export const validateAddressParam = (req, res, next) => {
  try {
    const { address } = req.params;
    
    if (!isBtcAddress(address)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Invalid BTC address format',
        message: 'The provided address parameter is not a valid Bitcoin address'
      });
    }
    
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Address validation error',
      message: error.message
    });
  }
};