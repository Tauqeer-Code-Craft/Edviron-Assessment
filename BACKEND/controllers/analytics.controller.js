const OrderStatus = require("../models/OrderStatus");

const getPaymentsAnalytics = async (req, res) => {
  try {
    const monthlyRevenue = await OrderStatus.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { $month: "$updatedAt" },
          total: { $sum: "$order_amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const revenueFormatted = monthlyRevenue.map((m) => ({
      month: `M${m._id}`,
      amount: m.total,
    }));

    const monthlyStatus = await OrderStatus.aggregate([
      {
        $group: {
          _id: { month: { $month: "$updatedAt" }, status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const grouped = {};
    monthlyStatus.forEach((item) => {
      const month = `M${item._id.month}`;
      if (!grouped[month]) grouped[month] = { month, success: 0, failed: 0, pending: 0 };
      grouped[month][item._id.status] = item.count;
    });

    const statusFormatted = Object.values(grouped);

    res.json({
      monthlyRevenue: revenueFormatted,
      monthlyStatus: statusFormatted,
    });
  } catch (err) {
    console.error("Analytics fetch failed:", err);
    res.status(500).json({ error: "Analytics fetch failed" });
  }
};

module.exports = { getPaymentsAnalytics };
