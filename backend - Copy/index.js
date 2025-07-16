import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectDB, sequelize } from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Load .env
dotenv.config();

// Init express
const app = express();
// UBAH PORT DI SINI DARI 5500 MENJADI 5000
const PORT = process.env.PORT || 5000; 

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json()); // Untuk JSON body parsing

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/images", express.static("./public/images"));

// Health check route
app.get("/", (req, res) => {
  res.send("✅ API running: Hotel Booking API");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "❌ Endpoint tidak ditemukan",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    message: "❌ Terjadi kesalahan di server!",
    error: err.message,
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected!");

    await sequelize.sync({ alter: true }); // Gunakan alter: true di dev
    console.log("✅ Tables synced!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Gagal memulai server:", err);
    process.exit(1);
  }
};

startServer();
