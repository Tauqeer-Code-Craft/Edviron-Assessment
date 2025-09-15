const mongoose = require("mongoose");

const OrderStatusSchema = new mongoose.Schema(
  {
    collect_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    order_amount: {
      type: Number,
      required: true,
    },
    transaction_amount: {
      type: Number,
      default: 0,
    },
    payment_mode: {
      type: String,
      trim: true,
    },
    payment_details: {
      type: String,
      trim: true,
    },
    bank_reference: {
      type: String,
      trim: true,
    },
    payment_message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    error_message: {
      type: String,
      trim: true,
    },
    payment_time: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderStatus", OrderStatusSchema);
