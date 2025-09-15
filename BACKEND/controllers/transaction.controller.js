const OrderStatus = require("../models/OrderStatus");
const Order = require("../models/Order");
const mongoose = require("mongoose");

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "payment_time", order = "desc", status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const matchStage = status ? { status } : {};

    const transactions = await OrderStatus.aggregate([
      { $match: matchStage},
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },
      { $sort: { [`order.${sort}`]: order === "desc" ? -1 : 1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          collect_id: 1,
          school_id:"$order.school_id",
          gateway_name:"$order.gateway_name",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: "$_id"
        }
      }
    ]);

    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTransactionsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { page = 1, limit = 10, sort = "payment_time", order = "desc" } = req.query;
    const skip = (page-1) * limit;

    const transactions = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },
      { $match: { "order.school_id": schoolId } },
      { $sort: { [sort]: order === "desc" ? -1 : 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          collect_id: 1,
          school_id:"$order.school_id",
          gateway_name:"$order.gateway_name",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: "$_id"
        }
      }
    ]);

    res.json(transactions);
  } catch (err) {
    console.error("Error fetching school transactions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTransactionStatus = async (req, res) => {
  try {
    const { custom_order_id } = req.params;

    if (!isValidObjectId(custom_order_id)) {
      return res.status(400).json({ error: "Invalid custom_order_id" });
    }

    const transaction = await OrderStatus.findById(custom_order_id);

    if (!transaction) {
      return res.status(404).json({ status: "Not Found" });
    }

    res.json({ status: transaction.status });
  } catch (err) {
    console.error("Error fetching transaction status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
