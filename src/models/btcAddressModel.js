import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";
import { wallet } from "./wallet.js";

export const btcAddress = sequelize.define('BtcAddress', {
  address_id: {
    type: DataTypes.UUID,
    unique: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'wallet',
      key: 'user_id'
    }
  },
  wallet_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'wallet',
      key: 'wallet_id'
    }
  },
  address: {
    type: DataTypes.STRING(62),
    unique: true,
    allowNull: false,
    validate: {
      len: [26, 62],
      notEmpty: true,
      isValidBitcoinAddress(value) {
        // Bitcoin address validation - supports mainnet and testnet
        const bitcoinAddressRegex = /^[13mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1|tb1)[a-z0-9]{39,59}$/;
        if (!bitcoinAddressRegex.test(value)) {
          throw new Error('Invalid Bitcoin address format');
        }
      }
    }
  },
  address_type: {
    type: DataTypes.ENUM('legacy', 'segwit', 'native_segwit'),
    allowNull: false,
    defaultValue: 'native_segwit'
  },
  public_key: {
    type: DataTypes.STRING(130),
    allowNull: true
  },
  private_key: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  derivation_path: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'BIP44/49/84 derivation path'
  },
  label: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null
  },
  confirmed_balance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      min: 0
    },
    comment: 'Confirmed balance in BTC'
  },
  unconfirmed_balance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      min: 0
    },
    comment: 'Unconfirmed balance in BTC'
  },
  // Virtual field for total balance
  total_balance: {
    type: DataTypes.VIRTUAL,
    get() {
      return parseFloat(this.confirmed_balance || 0) + parseFloat(this.unconfirmed_balance || 0);
    }
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether address has been used in transactions'
  },
  is_change: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this is a change address'
  },
  is_imported: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether address was imported (not generated)'
  },
  watch_only: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this is a watch-only address (no private key)'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether address is currently active'
  },
  last_used_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time address was used in a transaction'
  },
  last_balance_update: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    comment: 'Last time balance was updated'
  },
  transaction_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
   // Flexible metadata 
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional flexible metadata'
  },
  // Enhanced status management
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'compromised', 'archived'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'btc_addresses',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['address']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['wallet_id']
    },
    {
      fields: ['address_type']
    },
    {
      fields: ['is_used']
    },
    {
      fields: ['is_change']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['status']
    },
    {
      fields: ['confirmed_balance']
    },
    {
      fields: ['watch_only']
    },
    {
      fields: ['last_balance_update']
    }
  ],
   // Model validation
  validate: {
    // Ensure watch-only addresses don't have private keys
    watchOnlyValidation() {
      if (this.watch_only && this.private_key) {
        throw new Error('Watch-only addresses cannot have private keys');
      }
      if (!this.watch_only && !this.private_key) {
        throw new Error('Non-watch-only addresses must have private keys');
      }
    }
  }
});

// Instance Methods
btcAddress.prototype.updateBalance = async function(confirmedBalance, unconfirmedBalance) {
  await this.update({
    confirmed_balance: confirmedBalance,
    unconfirmed_balance: unconfirmedBalance,
    last_balance_update: new Date()
  });
};

btcAddress.prototype.markAsUsed = async function() {
  if (!this.is_used) {
    await this.update({
      is_used: true,
      last_used_at: new Date()
    });
  }
};

btcAddress.prototype.incrementTransactionCount = async function() {
  await this.increment('transaction_count');
  await this.update({ last_used_at: new Date() });
};

// Class Methods
btcAddress.findActive = function() {
  return this.findAll({
    where: { 
      is_active: true,
      status: 'active'
    }
  });
};

btcAddress.findByAddress = function(address) {
  return this.findOne({
    where: { address }
  });
};

btcAddress.findByWallet = function(walletId) {
  return this.findAll({
    where: { wallet_id: walletId },
    order: [['created_at', 'ASC']]
  });
};

btcAddress.findWatchOnly = function() {
  return this.findAll({
    where: { watch_only: true }
  });
};

btcAddress.findWithBalance = function() {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { confirmed_balance: { [sequelize.Op.gt]: 0 } },
        { unconfirmed_balance: { [sequelize.Op.gt]: 0 } }
      ]
    }
  });
};

// Table Associations
btcAddress.belongsTo(wallet, { 
  foreignKey: 'wallet_id', 
  as: 'wallet' 
});

wallet.hasMany(btcAddress, { 
  foreignKey: 'wallet_id', 
  as: 'btc_addresses' 
});

// Hooks
btcAddress.addHook('beforeCreate', (address) => {
  // Auto-generate UUID if not provided
  if (!address.address_id) {
    address.address_id = DataTypes.UUIDV4();
  }
});

btcAddress.addHook('beforeUpdate', (address) => {
  // Update last_balance_update when balance changes
  if (address.changed('confirmed_balance') || address.changed('unconfirmed_balance')) {
    address.last_balance_update = new Date();
  }
});

export default btcAddress;

