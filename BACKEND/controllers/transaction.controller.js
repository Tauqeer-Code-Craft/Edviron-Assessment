const OrderStatus = require("../models/OrderStatus");
const Order = require("../models/Order");
const mongoose = require("mongoose");

exports.getTransactions = async (req, res) => {
  const { page = 1, limit = 10, sort = "payment_time", order = "desc" } = req.query;
  const skip = (page - 1) * limit;

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
    { $sort: { [sort]: order === "desc" ? -1 : 1 } },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
    {
      $project: {
        collect_id: 1,
        "order.school_id": 1,
        "order.gateway_name": 1,
        order_amount: 1,
        transaction_amount: 1,
        status: 1,
        custom_order_id: "$_id"
      }
    }
  ]);

  res.json(transactions);
};

exports.getTransactionsBySchool = async (req, res) => {
  const { schoolId } = req.params;
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
    { $match: { "order.school_id": schoolId } }
  ]);
  res.json(transactions);
};

exports.getTransactionStatus = async (req, res) => {
  const { custom_order_id } = req.params;
  const transaction = await OrderStatus.findById(custom_order_id);
  res.json({ status: transaction?.status || "Not Found" });
};
