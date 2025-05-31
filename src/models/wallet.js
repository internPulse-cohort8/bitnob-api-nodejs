import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";
import { transaction } from "./transaction.js";

export const wallet = sequelize.define('Wallet', {
    wallet_id: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        unique: true,  
        allowNull: false,
    },
    wallet_type: {
        type: DataTypes.STRING(10),
        defaultValue: 'BTC'
    },
    balance: {
        type: DataTypes.DECIMAL(18, 8),
        defaultValue: 0.0
    },
    currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'BTC'
    },
    wallet_address: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    wallet_status: {
        type: DataTypes.STRING(50),
        defaultValue: 'isActive'
    }
},
    {   tableName: 'wallet',
        timestamps: true
    }
);

//Table Association
wallet.hasMany(transaction, { foreignKey: 'wallet_id', as: 'transactions' });
transaction.belongsTo(wallet, { foreignKey: 'wallet_id', as: 'wallet' });