const mongoose = require("mongoose");
const { Schema } = mongoose;
const ReportSchema = new Schema({
  reportDate: Date,
  startDate: Date,
  endDate: Date,
  totalOrders: Number,
  totalRevenue: Number,
  avgOrderValue: Number,
  topProducts: Array,
  topCustomers: Array,
  regionWiseStats: Array,
  categoryWiseStats: Array,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("AnalyticsReport", ReportSchema);
