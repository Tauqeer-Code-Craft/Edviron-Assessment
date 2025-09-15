const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createPayment } = require("../controllers/payment.controller");
const verifySignature = require("../utils/verfySignature");
const OrderStatus = require("../models/OrderStatus");
const WebhookLog = require("../models/WebhookLog");


router.post("/create-payment", authMiddleware , createPayment);

router.post("/webhook", async(req, res)=>{
    try{
        const payload = req.body;
        const signature = req.headers["x-webhook-signature"];

        const isValid = verifySignature(payload, signature, process.env.PAYMENT_API_KEY);

        if(!isValid){
            return res.status(401).json({ error: "Invalid signature" });
        }

        await WebhookLog.create({ payload });

        const orderInfo = payload.order_info;

        if (!orderInfo || !orderInfo.order_id) {
            return res.status(400).json({ error: "Invalid payload structure" });
        }

        await OrderStatus.findOneAndUpdate(      
        { collect_id: orderInfo.order_id },
        {
        transaction_amount: orderInfo.transaction_amount,
        payment_mode: orderInfo.payment_mode,
        payment_details: orderInfo.payment_details,
        bank_reference: orderInfo.bank_reference,
        payment_message: orderInfo.payment_message,
        status: orderInfo.status,
        error_message: orderInfo.error_message,
        payment_time: orderInfo.payment_time,
      },
      { new: true }
    );
    res.json({ success: true })
    }
    catch(err){
        console.error("Webhook error:", err.message);
        res.status(500).json({ error: "Webhook processing failed" });
    }
})

module.exports = router;