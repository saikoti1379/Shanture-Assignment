const Order = require("../models/Order");
const AnalyticsReport = require("../models/AnalyticsReport");

function qDate(s) {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d)) return null;
  return d;
}

exports.generate = async (req, res) => {
  try {
    const start = qDate(req.query.start),
      end = qDate(req.query.end);
    const match = {};
    if (start && end) match.orderDate = { $gte: start, $lte: end };
    else if (start) match.orderDate = { $gte: start };
    else if (end) match.orderDate = { $lte: end };

    const metrics = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
      {
        $project: { _id: 0, totalOrders: 1, totalRevenue: 1, avgOrderValue: 1 },
      },
    ]).allowDiskUse(true);

    const topProducts = await Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQty: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.qty", "$items.unitPrice"] } },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $sort: { totalQty: -1 } },
      { $limit: 10 },
      {
        $project: {
          productId: "$_id",
          name: "$product.name",
          totalQty: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]).allowDiskUse(true);

    const topCustomers = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$customerId",
          revenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $project: {
          customerId: "$_id",
          name: "$customer.name",
          revenue: 1,
          totalOrders: 1,
          _id: 0,
        },
      },
    ]).allowDiskUse(true);

    const regionStats = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$region",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $project: { region: "$_id", totalOrders: 1, totalRevenue: 1, _id: 0 } },
    ]).allowDiskUse(true);

    const categoryStats = await Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$product.category",
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: { $multiply: ["$items.qty", "$items.unitPrice"] },
          },
        },
      },
      {
        $project: { category: "$_id", totalOrders: 1, totalRevenue: 1, _id: 0 },
      },
    ]).allowDiskUse(true);

    const report = {
      reportDate: new Date(),
      startDate: start || null,
      endDate: end || null,
      totalOrders: metrics[0]?.totalOrders || 0,
      totalRevenue: metrics[0]?.totalRevenue || 0,
      avgOrderValue: metrics[0]?.avgOrderValue || 0,
      topProducts,
      topCustomers,
      regionWiseStats: regionStats,
      categoryWiseStats: categoryStats,
    };

    await AnalyticsReport.create(report);
    res.json(report);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.listReports = async (req, res) => {
  const AR = require("../models/AnalyticsReport");
  const reports = await AR.find().sort({ createdAt: -1 }).limit(50);
  res.json(reports);
};
