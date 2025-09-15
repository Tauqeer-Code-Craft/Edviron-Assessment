require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes
const authRoutes = require("./routes/auth.route");
const paymentRoutes = require('./routes/payment.route')
const transactionRoutes = require("./routes/transactions.route");
const analyticsRoutes = require("./routes/analytics.route");
const app = express();

// Middleware
app.use(helmet());  // headers will be secured
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({
    limit: "10kb"
}))
app.use(morgan("combined"));  // logging the Http req's

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 Handler
app.use((req, res, next)=>{
    res.status(404).json({
        message: "Route not found"
    });
});

//Error Handler
app.use((err, req, res, next)=>{
    console.error("Error:", err.stack);
    res.status(500).json({
        message: "Something went Wrong"
    });
});

module.exports = app;