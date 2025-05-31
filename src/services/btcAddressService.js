import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as bip39 from 'bip39';
import * as tinysecp256k1 from 'tiny-secp256k1';
import { v4 as uuidv4 } from 'uuid';
import { btcAddress } from '../models/btcAddressModel.js';
import { wallet } from '../models/wallet.js';
import axios from 'axios';
import { config } from '../configs/config.env.js';

// Initialize Bitcoin library
const bip32 = BIP32Factory(tinysecp256k1);

// Bitcoin networks
const NETWORKS = {
  mainnet: bitcoin.networks.bitcoin,
  testnet: bitcoin.networks.testnet
};

class BtcAddressService {
  constructor() {
    this.network = process.env.NODE_ENV === 'production' ? NETWORKS.mainnet : NETWORKS.testnet;
    this.bitnobApiUrl = config.BITNOB_SANDBOX_API_URL;
    this.bitnobApiKey = config.BITNOB_API_KEY;
  }

  /**
   * Generate a new BTC address
   */
  async generateNewAddress({ user_id, address_type = 'native_segwit', label, derivation_path }) {
    try {
      // Generate mnemonic if not provided
      const mnemonic = bip39.generateMnemonic();
      const seed = await bip39.mnemonicToSeed(mnemonic);
      
      // Create master key from seed
      const master = bip32.fromSeed(seed, this.network);
      
      // Use custom derivation path or default
      const path = derivation_path || this.getDefaultDerivationPath(address_type);
      const child = master.derivePath(path);
      
      // Generate address based on type
      const addressData = this.generateAddressByType(child, address_type);
      
      // Check if wallet exists for user
      let userWallet = await wallet.findOne({ where: { user_id } });
      
      if (!userWallet) {
        // Create new wallet if doesn't exist
        userWallet = await wallet.create({
          wallet_id: uuidv4(),
          user_id,
          wallet_type: 'BTC',
          balance: 0.0,
          currency: 'BTC',
          wallet_address: addressData.address,
          wallet_status: 'isActive'
        });
      }

      // Save address to database
      const btcAddressRecord = await btcAddress.create({
        address_id: uuidv4(),
        user_id,
        wallet_id: userWallet.wallet_id,
        address: addressData.address,
        address_type,
        public_key: child.publicKey.toString('hex'),
        private_key: child.privateKey ? child.privateKey.toString('hex') : null,
        derivation_path: path,
        label: label || `BTC Address ${Date.now()}`,
        balance: 0.0,
        is_used: false,
        is_change: false
      });

      return {
        success: true,
        data: {
          address_id: btcAddressRecord.address_id,
          address: addressData.address,
          address_type,
          public_key: btcAddressRecord.public_key,
          derivation_path: path,
          label: btcAddressRecord.label,
          qr_code: this.generateQRCodeData(addressData.address)
        }
      };
    } catch (error) {
      console.error('Error generating BTC address:', error);
      return {
        success: false,
        error: 'Failed to generate BTC address',
        message: error.message
      };
    }
  }

  /**
   * Generate multiple BTC addresses
   */
  async generateMultipleAddresses({ user_id, count, address_type = 'native_segwit', start_index = 0 }) {
    try {
      const addresses = [];
      const mnemonic = bip39.generateMnemonic();
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const master = bip32.fromSeed(seed, this.network);

      // Check if wallet exists for user
      let userWallet = await wallet.findOne({ where: { user_id } });
      
      if (!userWallet) {
        // Create new wallet with first address
        const firstPath = this.getDefaultDerivationPath(address_type, start_index);
        const firstChild = master.derivePath(firstPath);
        const firstAddressData = this.generateAddressByType(firstChild, address_type);
        
        userWallet = await wallet.create({
          wallet_id: uuidv4(),
          user_id,
          wallet_type: 'BTC',
          balance: 0.0,
          currency: 'BTC',
          wallet_address: firstAddressData.address,
          wallet_status: 'isActive'
        });
      }

      for (let i = 0; i < count; i++) {
        const index = start_index + i;
        const path = this.getDefaultDerivationPath(address_type, index);
        const child = master.derivePath(path);
        const addressData = this.generateAddressByType(child, address_type);

        const btcAddressRecord = await btcAddress.create({
          address_id: uuidv4(),
          user_id,
          wallet_id: userWallet.wallet_id,
          address: addressData.address,
          address_type,
          public_key: child.publicKey.toString('hex'),
          private_key: child.privateKey ? child.privateKey.toString('hex') : null,
          derivation_path: path,
          label: `BTC Address ${index}`,
          balance: 0.0,
          is_used: false,
          is_change: false
        });

        addresses.push({
          address_id: btcAddressRecord.address_id,
          address: addressData.address,
          address_type,
          derivation_path: path,
          index
        });
      }

      return {
        success: true,
        data: {
          addresses,
          count: addresses.length,
          mnemonic: mnemonic // In production, encrypt this!
        }
      };
    } catch (error) {
      console.error('Error generating multiple BTC addresses:', error);
      return {
        success: false,
        error: 'Failed to generate multiple BTC addresses',
        message: error.message
      };
    }
  }

  /**
   * Validate a BTC address
   */
  async validateAddress(address) {
    try {
      let isValid = false;
      let addressType = 'unknown';
      let network = 'unknown';

      // Try to decode the address
      try {
        bitcoin.address.toOutputScript(address);
        isValid = true;

        // Determine address type
        if (address.startsWith('1')) {
          addressType = 'legacy';
        } else if (address.startsWith('3')) {
          addressType = 'segwit';
        } else if (address.startsWith('bc1')) {
          addressType = 'native_segwit';
          network = 'mainnet';
        } else if (address.startsWith('tb1')) {
          addressType = 'native_segwit';
          network = 'testnet';
        }
      } catch {
        isValid = false;
      }

      return {
        address,
        is_valid: isValid,
        address_type: addressType,
        network
      };
    } catch (error) {
      console.error('Error validating BTC address:', error);
      return {
        address,
        is_valid: false,
        error: error.message
      };
    }
  }

  /**
   * Get address details from database
   */
  async getAddressDetails(address) {
    try {
      const addressRecord = await btcAddress.findOne({
        where: { address },
        include: [{
          model: wallet,
          as: 'wallet'
        }]
      });

      if (!addressRecord) {
        return {
          success: false,
          error: 'Address not found',
          message: 'The specified BTC address was not found in the database'
        };
      }

      return {
        success: true,
        data: {
          address_id: addressRecord.address_id,
          address: addressRecord.address,
          address_type: addressRecord.address_type,
          balance: addressRecord.balance,
          label: addressRecord.label,
          derivation_path: addressRecord.derivation_path,
          is_used: addressRecord.is_used,
          is_change: addressRecord.is_change,
          created_at: addressRecord.createdAt,
          wallet_info: {
            wallet_id: addressRecord.wallet.wallet_id,
            wallet_status: addressRecord.wallet.wallet_status
          }
        }
      };
    } catch (error) {
      console.error('Error getting BTC address details:', error);
      return {
        success: false,
        error: 'Failed to get address details',
        message: error.message
      };
    }
  }

  /**
   * Import an existing BTC address
   */
  async importAddress({ user_id, address, private_key, label, watch_only = false }) {
    try {
      // Validate the address
      const validation = await this.validateAddress(address);
      
      if (!validation.is_valid) {
        return {
          success: false,
          error: 'Invalid BTC address',
          message: 'The provided address is not a valid Bitcoin address'
        };
      }

      // Check if address already exists
      const existingAddress = await btcAddress.findOne({ where: { address } });
      
      if (existingAddress) {
        return {
          success: false,
          error: 'Address already exists',
          message: 'This BTC address is already imported'
        };
      }

      // Get or create wallet
      let userWallet = await wallet.findOne({ where: { user_id } });
      
      if (!userWallet) {
        userWallet = await wallet.create({
          wallet_id: uuidv4(),
          user_id,
          wallet_type: 'BTC',
          balance: 0.0,
          currency: 'BTC',
          wallet_address: address,
          wallet_status: 'isActive'
        });
      }

      // Create address record
      const btcAddressRecord = await btcAddress.create({
        address_id: uuidv4(),
        user_id,
        wallet_id: userWallet.wallet_id,
        address,
        address_type: validation.address_type,
        public_key: null, // Will be derived from private key if provided
        private_key: watch_only ? null : private_key,
        derivation_path: null, // Not applicable for imported addresses
        label: label || `Imported BTC Address ${Date.now()}`,
        balance: 0.0,
        is_used: false,
        is_change: false,
        is_imported: true,
        watch_only
      });

      return {
        success: true,
        data: {
          address_id: btcAddressRecord.address_id,
          address: btcAddressRecord.address,
          address_type: validation.address_type,
          label: btcAddressRecord.label,
          watch_only,
          imported: true
        }
      };
    } catch (error) {
      console.error('Error importing BTC address:', error);
      return {
        success: false,
        error: 'Failed to import BTC address',
        message: error.message
      };
    }
  }

  /**
   * Get address balance using Bitnob API or external service
   */
  async getAddressBalance(address) {
    try {
      // First validate the address
      const validation = await this.validateAddress(address);
      
      if (!validation.is_valid) {
        return {
          success: false,
          error: 'Invalid BTC address'
        };
      }

      // Try to get balance from Bitnob API first
      try {
        const response = await axios.get(`${this.bitnobApiUrl}/addresses/${address}/balance`, {
          headers: {
            'Authorization': `Bearer ${this.bitnobApiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          // Update balance in database
          await btcAddress.update(
            { balance: response.data.balance },
            { where: { address } }
          );

          return {
            success: true,
            data: {
              address,
              balance: response.data.balance,
              confirmed_balance: response.data.confirmed_balance || response.data.balance,
              unconfirmed_balance: response.data.unconfirmed_balance || 0,
              source: 'bitnob'
            }
          };
        }
      } catch (bitnobError) {
        console.warn('Bitnob API error, falling back to alternative:', bitnobError.message);
      }

      // Fallback to blockchain.info API for balance checking
      try {
        const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
        const balance = response.data.final_balance / 100000000; // Convert from satoshis to BTC

        // Update balance in database
        await btcAddress.update(
          { balance },
          { where: { address } }
        );

        return {
          success: true,
          data: {
            address,
            balance,
            confirmed_balance: balance,
            unconfirmed_balance: 0,
            source: 'blockchain.info'
          }
        };
      } catch (fallbackError) {
        console.error('Fallback API error:', fallbackError.message);
        
        // Return database balance if APIs fail
        const addressRecord = await btcAddress.findOne({ where: { address } });
        
        return {
          success: true,
          data: {
            address,
            balance: addressRecord ? addressRecord.balance : 0,
            confirmed_balance: addressRecord ? addressRecord.balance : 0,
            unconfirmed_balance: 0,
            source: 'database',
            note: 'Balance from database - API services unavailable'
          }
        };
      }
    } catch (error) {
      console.error('Error getting BTC address balance:', error);
      return {
        success: false,
        error: 'Failed to get address balance',
        message: error.message
      };
    }
  }

  /**
   * Generate address based on type
   */
  generateAddressByType(keyPair, addressType) {
    // Convert Uint8Array to Buffer if needed
    const publicKey = Buffer.isBuffer(keyPair.publicKey) ? 
                     keyPair.publicKey : 
                     Buffer.from(keyPair.publicKey);
    
    switch (addressType) {
      case 'legacy':
        return {
          address: bitcoin.payments.p2pkh({ pubkey: publicKey, network: this.network }).address,
          type: 'P2PKH'
        };
      
      case 'segwit':
        return {
          address: bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this.network }),
            network: this.network
          }).address,
          type: 'P2SH-P2WPKH'
        };
      
      case 'native_segwit':
      default:
        return {
          address: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this.network }).address,
          type: 'P2WPKH'
        };
    }
  }

  /**
   * Get default derivation path
   */
  getDefaultDerivationPath(addressType, index = 0) {
    const purpose = addressType === 'legacy' ? '44' : 
                   addressType === 'segwit' ? '49' : '84';
    const coinType = this.network === NETWORKS.mainnet ? '0' : '1';
    
    return `m/${purpose}'/${coinType}'/0'/0/${index}`;
  }

  /**
   * Generate QR code data
   */
  generateQRCodeData(address) {
    return `bitcoin:${address}`;
  }
}

export default new BtcAddressService();