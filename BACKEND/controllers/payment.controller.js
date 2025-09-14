const axios = require("axios");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const OrderStatus= require("../models/OrderStatus");

const createPayment = async (req, res) => {
    try{
        const { school_id, student_info, order_amount } = req.body;

        //Create Order
        const orderDoc = await Order.create({
            school_id,
            student_info,
            gateway_name: "PhonePe"
        });

        // Generate signed JWT for Payment API
        const payload  = { collect_id: orderDoc._id, order_amount};
        const signed = jwt.sign(payload, process.env.PAYMENT_API_KEY);

        // Call payment API
        const response = await axios.post(
            "https://test-payment-api.com/create-collect-request",
            { ...payload, token: signed },
            { headers: {"pg_key": process.env.PG_KEY } }
        );

        // Save initial order status
        await OrderStatus.create({
            collect_id: orderDoc._id,
            order_amount,
            status: "pending",
        });
        res.json({
            payment_url: response.data.redirect_url || null,
            order_id: orderDoc._id
        });
    }
    catch(err){
        console.error("Payment creation failed:",err.message);
        res.status(500).json({
            error: "Payment creation Failed",
            details: err.message
        });
    }
};

module.exports = { createPayment };