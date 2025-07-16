import express from "express";
import {
  createPayment,
  getAllPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

// ✅ Buat pembayaran baru
router.post("/", createPayment);

// ✅ Ambil semua pembayaran
router.get("/", getAllPayments);

export default router;