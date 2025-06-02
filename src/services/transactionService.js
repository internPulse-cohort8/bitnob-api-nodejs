import BaseBitnobService from './baseBitnobService.js';
import { transaction } from "../models/transaction.js";

class TransactionService extends BaseBitnobService {
  async createTransaction(transactionData) {
    try {
      this.logRequest('/transactions', transactionData);

      const txn = await transaction.create(transactionData);
      
      return {
        success: true,
        data: txn
      };
    } catch (error) {
      this.logError(error);
      return {
        success: false,
        error: error.message || 'Failed to create transaction'
      };
    }
  }

  async getAllTransactions() {
    try {
      this.logRequest('/transactions');

      const txns = await transaction.findAll();
      
      return {
        success: true,
        data: txns
      };
    } catch (error) {
      this.logError(error);
      return {
        success: false,
        error: error.message || 'Failed to fetch transactions'
      };
    }
  }

  async getTransactionById(id) {
    try {
      this.logRequest(`/transactions/${id}`, { id });

      const txn = await transaction.findByPk(id);
      
      if (!txn) {
        return {
          success: false,
          error: 'Transaction not found',
          status: 404
        };
      }

      return {
        success: true,
        data: txn
      };
    } catch (error) {
      this.logError(error);
      return {
        success: false,
        error: error.message || 'Failed to get transaction'
      };
    }
  }

  async updateTransactionStatus(id, statusData) {
    try {
      this.logRequest(`/transactions/${id}/status`, { id, ...statusData });

      const txn = await transaction.findByPk(id);
      
      if (!txn) {
        return {
          success: false,
          error: 'Transaction not found',
          status: 404
        };
      }

      txn.txn_status = statusData.txn_status;
      txn.confirmed_at = statusData.confirmed_at;
      await txn.save();

      return {
        success: true,
        data: txn
      };
    } catch (error) {
      this.logError(error);
      return {
        success: false,
        error: error.message || 'Failed to update transaction status'
      };
    }
  }
}
export default new TransactionService();