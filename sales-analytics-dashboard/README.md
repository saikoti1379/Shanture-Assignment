ofessional **`README.md`** for your **Shanture Assignment (Sales Analytics Dashboard)** project. It includes setup s, features, and usage. You can copy it as-is and adjust details like URLs or screenshots later.


# Shanture Assignment - Sales Analytics Dashboard

A **Sales Analytics Dashboard** built with **MERN stack** (MongoDB, Express, React, Node.js), interactive charts.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- Generate sales reports with **date range** filters.
- **Advanced filtering & search** by:
  - Customer Name
  - Product Name
  - Category
  - Region
  - Revenue range (min/max)
- Interactive charts with **ECharts**:
  - Revenue by Region (Pie Chart)
  - Revenue by Category (Bar Chart)
  - Top Products (Bar Chart)
- **Top Customers** and **Top Products** list.
- Raw JSON data view for detailed analytics.
- Real-time updates using **Socket.io**.
- Reset filters to quickly view all data.

---

## Tech Stack

- **Frontend:** React, Axios, ECharts  
- **Backend:** Node.js, Express  
- **Database:** MongoDB, Mongoose  
- **Realtime:** Socket.io  
- **Others:** dotenv, Faker.js for seeding dummy data  

---

## Project Structure

```

sales-analytics-dashboard/
│
├── node\_modules/
│
├── src/
│   ├── backend/
│   │   ├── controllers/
│   │   │   └── analyticsController.js
│   │   ├── models/
│   │   │   ├── AnalyticsReport.js
│   │   │   ├── Customer.js
│   │   │   ├── Order.js
│   │   │   └── Product.js
│   │   ├── routes/
│   │   │   ├── analytics.js
│   │   │   └── api.js
│   │   ├── scripts/
│   │   │   └── seed.js
│   │   └── server.js
│   │
│   └── frontend/
│       ├── src/
│       │   ├── App.js
│       │   ├── Dashboard.css
│       │   └── index.js
│       ├── package.json
│       └── .env
│
├── package.json
└── README.md

````

---

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd sales-analytics-dashboard
````

2. **Install backend dependencies**

```bash
cd src/backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Setup environment variables**

Create a `.env` file in `src/backend`:

```
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
```

---

## Seed Database (Optional)

To generate sample data:

```bash
cd src/backend
node scripts/seed.js
```

This will create:

* 40 Products
* 200 Customers
* 1500 Orders (with random dates & regions)

---

## Usage

1. **Run Backend**

```bash
cd src/backend
node server.js
```

2. **Run Frontend**

```bash
cd src/frontend
npm start
```

3. Open browser at `http://localhost:3000` to access the dashboard.

---

## API Endpoints

| Endpoint                     | Method | Description                        |
| ---------------------------- | ------ | ---------------------------------- |
| `/api/analytics/generate`    | GET    | Generate report (supports filters) |
| `/api/analytics/listReports` | GET    | List last 50 reports               |

**Supported Query Parameters:**

* `start` : Start date
* `end` : End date
* `customerName` : Filter by customer name
* `productName` : Filter by product name
* `category` : Filter by product category
* `region` : Filter by region
* `minRevenue` : Minimum total order revenue
* `maxRevenue` : Maximum total order revenue

