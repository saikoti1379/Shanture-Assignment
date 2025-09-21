require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

const { faker } = require("@faker-js/faker");

const MONGO_URI = process.env.MONGO_URI;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rDate(s, e) {
  return new Date(s.getTime() + Math.random() * (e.getTime() - s.getTime()));
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to", MONGO_URI);
  await Product.deleteMany({});
  await Customer.deleteMany({});
  await Order.deleteMany({});

  const cats = ["Electronics", "Apparel", "Home", "Sports", "Books"];
  const products = [];
  for (let i = 1; i <= 40; i++) {
    const p = await Product.create({
      name: `Product ${i}`,
      sku: `SKU${1000 + i}`,
      category: cats[i % cats.length],
      price: Math.round(rand(200, 20000) / 10) * 10,
    });
    products.push(p);
  }
  console.log("Products", products.length);

  const regions = [
    "India North",
    "India South",
    "India East",
    "India West",
    "India Central",
  ];

  const customers = [];
  for (let i = 1; i <= 200; i++) {
    const fullName = faker.person.firstName() + " " + faker.person.lastName();
    const c = await Customer.create({
      name: fullName,
      email: faker.internet.email(), // random realistic email
      region: regions[i % regions.length],
      customerType: i % 10 === 0 ? "Wholesale" : "Retail",
    });
    customers.push(c);
  }
  console.log("Customers", customers.length);

  const now = new Date();
  const twoYears = new Date(
    now.getFullYear() - 2,
    now.getMonth(),
    now.getDate()
  );
  for (let i = 0; i < 1500; i++) {
    const orderDate = rDate(twoYears, now);
    const cust = customers[rand(0, customers.length - 1)];
    const itemCount = rand(1, 4);
    let items = [];
    let total = 0;
    for (let j = 0; j < itemCount; j++) {
      const p = products[rand(0, products.length - 1)];
      const qty = rand(1, 5);
      items.push({ productId: p._id, qty, unitPrice: p.price });
      total += qty * p.price;
    }
    await Order.create({
      orderDate,
      customerId: cust._id,
      items,
      totalAmount: total,
      region: cust.region,
    });
    if (i % 200 === 0) console.log("Orders", i);
  }
  console.log("Seed complete");
  mongoose.connection.close();
}
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
