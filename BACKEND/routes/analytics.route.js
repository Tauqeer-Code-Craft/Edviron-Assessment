const express = require("express");
const router = express.Router();
const { getPaymentsAnalytics } = require("../controllers/analytics.controller");

router.get("/payments", getPaymentsAnalytics);

module.exports = router;
