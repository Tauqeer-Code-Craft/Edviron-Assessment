const router = require("express").Router();
const authMiddleware = require("../middlerware/authMiddleware");
const { getTransactions, getTransactionsBySchool, getTransactionStatus } = require("../controllers/transaction.controller");

router.get("/transactions", authMiddleware, getTransactions);
router.get("/transactions/school/:schoolId", authMiddleware, getTransactionsBySchool);
router.get("/transaction-status/:custom_order_id", authMiddleware, getTransactionStatus);

module.exports = router;
