import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export const transaction = sequelize.define('transaction', {
    txn_id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    wallet_id: {  // foreign key for wallet table
        type: DataTypes.UUID,
        references:{
            model: 'wallet',
            key: 'wallet_id'
        },
        allowNull: false
    },
    txn_amount: {
        type: DataTypes.DECIMAL(18, 8),
        defaultValue: 0.0,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'BTC',
        allowNull: false
    },
    txn_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
        allowNull: false
    },
    txn_type: {
        type: DataTypes.ENUM('send', 'recieve'),
        allowNull: false
    },
    reference: { // From bitnob txn id
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    to_address:{
        type: DataTypes.STRING,
        unique: true,
    },

    from_address:{
        type: DataTypes.STRING,
        unique: true,
    },
    confirmed_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
},
{   timestamps: true,
    tableName: 'transaction'
});
export default transaction;