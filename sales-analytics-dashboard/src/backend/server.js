require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const analyticsRoutes = require("./routes/analytics");
const apiRoutes = require("./routes/api");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/sales_analytics";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/analytics", analyticsRoutes);
app.use("/api", apiRoutes);

const buildPath = path.join(__dirname, "public");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  const idx = path.join(buildPath, "index.html");
  if (require("fs").existsSync(idx)) return res.sendFile(idx);
  res.send("Frontend not built. Run npm run build.");
});

app.listen(PORT, () => console.log("Server running on", PORT));
