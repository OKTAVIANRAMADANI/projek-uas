// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);          // 🟢 POST /api/bookings
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.delete("/:id", cancelBooking);
router.put("/:id/status", updateBookingStatus);

export default router;