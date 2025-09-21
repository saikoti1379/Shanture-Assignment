const router = require("express").Router();
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

router.get("/products", async (req, res) =>
  res.json(await Product.find().limit(100))
);
router.get("/customers", async (req, res) =>
  res.json(await Customer.find().limit(100))
);
router.get("/orders", async (req, res) => {
  const { start, end } = req.query;
  const q = {};
  if (start || end) q.orderDate = {};
  if (start) q.orderDate.$gte = new Date(start);
  if (end) q.orderDate.$lte = new Date(end);
  res.json(await Order.find(q).limit(500));
});
module.exports = router;
