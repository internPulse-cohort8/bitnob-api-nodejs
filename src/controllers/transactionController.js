import { transaction } from "../models/transaction.js";

// src/controllers/transactionController.js

const { transaction } = require('../models');

exports.createTransaction = async (req, res) => {
  try {
    const txn = await transaction.create(req.body);
    res.status(201).json({ success: true, data: txn });
  } catch (error) {
    console.error("Create Transaction Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const txns = await transaction.findAll();
    res.status(200).json({ success: true, data: txns });
  } catch (error) {
    console.error("Fetch Transactions Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const txn = await transaction.findByPk(req.params.id);
    if (!txn) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, data: txn });
  } catch (error) {
    console.error("Get Transaction Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const txn = await transaction.findByPk(req.params.id);
    if (!txn) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    txn.txn_status = req.body.txn_status;
    txn.confirmed_at = req.body.confirmed_at;
    await txn.save();

    res.status(200).json({ success: true, data: txn });
  } catch (error) {
    console.error("Update Transaction Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
