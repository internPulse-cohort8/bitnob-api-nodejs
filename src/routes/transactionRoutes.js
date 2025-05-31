import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionStatus
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getAllTransactions);
router.get("/:txn_id", getTransactionById);
router.put("/:txn_id", updateTransactionStatus);

export default router;
