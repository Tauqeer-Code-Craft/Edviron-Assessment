const router = require("express").Router();
const cyrpto =  require("crypto");
const authMiddleware = require("../middlerware/authMiddleware");
const { createPayment } = require("../controllers/payment.controller");
const OrderStatus = require("../models/OrderStatus");
const WebhookLog = require("../models/WebhookLog");
const verifySignature = require("../utils/verfySignature");


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
        await OrderStatus.findByIdAndUpdate(      
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