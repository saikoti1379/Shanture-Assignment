import React, { useEffect, useState } from "react";
import axios from "axios";
function Card({ title, value }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
export default function App() {
  const [report, setReport] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  async function fetchReport(s, e) {
    setLoading(true);
    try {
      const params = {};
      if (s) params.start = s;
      if (e) params.end = e;
      const res = await axios.get("/api/analytics/generate", { params });
      setReport(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching report");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchReport();
  }, []);
  useEffect(() => {
    if (!report) return;
    try {
      const r = document.getElementById("regionChart");
      const c = document.getElementById("categoryChart");
      const p = document.getElementById("productsChart");
      if (r) {
        const chart = echarts.init(r);
        chart.setOption({
          title: { text: "Revenue by Region", left: "center" },
          tooltip: {},
          series: [
            {
              type: "pie",
              radius: "50%",
              data: report.regionWiseStats.map((x) => ({
                name: x.region,
                value: x.totalRevenue,
              })),
            },
          ],
        });
      }
      if (c) {
        const chart = echarts.init(c);
        chart.setOption({
          title: { text: "Revenue by Category", left: "center" },
          tooltip: {},
          xAxis: {
            type: "category",
            data: report.categoryWiseStats.map((x) => x.category),
          },
          yAxis: { type: "value" },
          series: [
            {
              type: "bar",
              data: report.categoryWiseStats.map((x) => x.totalRevenue),
            },
          ],
        });
      }
      if (p) {
        const chart = echarts.init(p);
        chart.setOption({
          title: { text: "Top Products", left: "center" },
          tooltip: {},
          xAxis: {
            type: "category",
            data: report.topProducts.map((x) => x.name),
          },
          yAxis: { type: "value" },
          series: [
            { type: "bar", data: report.topProducts.map((x) => x.totalQty) },
          ],
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [report]);
  return (
    <div>
      <header>
        <h1>Sales Analytics Dashboard</h1>
      </header>
      <div className="container">
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <label>
            Start:{" "}
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label>
            End:{" "}
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
          <button onClick={() => fetchReport(start, end)} disabled={loading}>
            Generate
          </button>
          <button
            onClick={() => {
              setStart("");
              setEnd("");
              fetchReport();
            }}
          >
            Reset
          </button>
        </div>
        <div className="cards">
          <Card
            title="Total Revenue"
            value={
              report
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(report.totalRevenue)
                : "—"
            }
          />
          <Card
            title="Total Orders"
            value={report ? report.totalOrders : "—"}
          />
          <Card
            title="Avg Order Value"
            value={
              report
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(report.avgOrderValue)
                : "—"
            }
          />
        </div>
        <div className="charts">
          <div id="regionChart" className="chart"></div>
          <div id="categoryChart" className="chart"></div>
          <div id="productsChart" className="chart"></div>
          <div className="chart" style={{ padding: 12, overflow: "auto" }}>
            <h4>Top Customers</h4>
            <ul>
              {report?.topCustomers?.map((c) => (
                <li key={c.customerId}>
                  {c.name} — ₹{(c.revenue || 0).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <section style={{ marginTop: 16 }}>
          <h3>Raw JSON</h3>
          <pre style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
            {JSON.stringify(report, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
