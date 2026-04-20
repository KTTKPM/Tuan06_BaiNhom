const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/order.route");

const app = express();

const DEFAULT_CORS_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:8083",
  "http://localhost:8084",
  "http://user-service:8081",
  "http://food-service:8082",
  "http://cart-service:8083",
  "http://payment-service:8084",
  "http://frontend:3000",
].join(",");

const allowedOrigins = (
  process.env.CORS_ALLOWED_ORIGINS || DEFAULT_CORS_ALLOWED_ORIGINS
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/order", orderRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "order-service",
    port: process.env.PORT || 8083,
  });
});

module.exports = app;
