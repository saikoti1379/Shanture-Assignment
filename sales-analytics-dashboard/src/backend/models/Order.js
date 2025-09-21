const mongoose = require("mongoose");
const { Schema } = mongoose;
const ItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  qty: Number,
  unitPrice: Number,
});
const OrderSchema = new Schema({
  orderDate: Date,
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  items: [ItemSchema],
  totalAmount: Number,
  region: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Order", OrderSchema);
