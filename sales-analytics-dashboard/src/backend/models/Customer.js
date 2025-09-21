const mongoose = require("mongoose");
const { Schema } = mongoose;
const CustomerSchema = new Schema({
  name: String,
  email: String,
  region: String,
  customerType: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Customer", CustomerSchema);
