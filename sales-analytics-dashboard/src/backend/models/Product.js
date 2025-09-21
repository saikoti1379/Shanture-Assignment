const mongoose = require("mongoose");
const { Schema } = mongoose;
const ProductSchema = new Schema({
  name: String,
  sku: String,
  category: String,
  price: Number,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Product", ProductSchema);
