import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Endpoint untuk registrasi
router.post("/register", (req, res, next) => {
    console.log('Request received at /api/auth/register (authRoutes)');
    next(); // Lanjutkan ke handler registerUser
}, registerUser);

// Endpoint untuk login
router.post("/login", (req, res, next) => {
    console.log('Request received at /api/auth/login (authRoutes)');
    next(); // Lanjutkan ke handler loginUser
}, loginUser);

export default router;