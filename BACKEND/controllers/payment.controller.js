const axios = require("axios");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const OrderStatus= require("../models/OrderStatus");

const createPayment = async (req, res) => {
    try{
        console.log("Incoming body:", req.body);
        const { school_id, student_info, order_amount, gateway_name } = req.body;

        if(!school_id || !student_info || !order_amount ){
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 1. Create local Order
        const orderDoc = await Order.create({
            school_id,
            student_info,
            gateway_name: "PhonePe"
        });

        // 2. Prepare paylaod
        const payload  = { collect_id: orderDoc._id, order_amount};
        
        //3. Sign payload
        const signed = jwt.sign(payload, process.env.PAYMENT_API_KEY,{
            expiresIn:"5m",
        });

        // 4. Call payment API
        // const response = await axios.post(
        //     "https://test-payment-api.com/create-collect-request",
        //     { ...payload, token: signed },
        //     { headers: {"pg_key": process.env.PG_KEY } }
        // );

        // 4.1 Call Mock payment Api
        const response = await axios.post(
            "https://httpbin.org/post",
            { ...payload, token: signed },
            { headers: { "pg_key": process.env.PG_KEY } }
        );

        // 5. Save initial order status
        await OrderStatus.create({
            collect_id: orderDoc._id,
            order_amount,
            status: "pending",
            gateway_name: gateway_name || "PhonePe",
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