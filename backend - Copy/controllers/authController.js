import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

dotenv.config();

// Validasi format email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Registrasi User
export const registerUser = async (req, res) => {
  console.log('Inside registerUser controller'); // Tambahkan ini
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array()); // Tambahkan ini
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  console.log('Received data:', { name, email, password }); // Tambahkan ini

  try {
    // Validasi format email
    if (!validateEmail(email)) {
      console.log("Email format invalid"); // Tambahkan ini
      return res.status(400).json({ message: "❌ Format email tidak valid!" });
    }

    // Cek apakah user sudah terdaftar
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      console.log("User already exists"); // Tambahkan ini
      return res.status(400).json({ message: "❌ Email sudah digunakan. Silakan login." });
    }

    // Validasi panjang password
    if (password.length < 6) {
      console.log("Password too short"); // Tambahkan ini
      return res.status(400).json({ message: "❌ Password harus minimal 6 karakter." });
    }

    // Hash password sebelum menyimpan ke database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Gunakan transaksi untuk memastikan konsistensi data
    const newUser = await User.create({ name, email, password: hashedPassword });
    console.log("New user created:", newUser.id); // Tambahkan ini

    // Generate token agar user langsung bisa login
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "✅ Registrasi berhasil!", token, user: newUser });
  } catch (error) {
    console.error("❌ Error registrasi (controller):", error.message); // Ubah ini
    res.status(500).json({ message: "❌ Kesalahan saat registrasi!", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  console.log('Inside loginUser controller'); // Tambahkan ini
  const { email, password } = req.body;

  try {
    // Cek apakah user terdaftar
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found"); // Tambahkan ini
      return res.status(404).json({ message: "❌ User tidak ditemukan. Silakan daftar dulu." });
    }

    // Bandingkan password yang dimasukkan dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch"); // Tambahkan ini
      return res.status(400).json({ message: "❌ Password salah!" });
    }

    // Generate token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "✅ Login berhasil!", token, user });
  } catch (error) {
    console.error("❌ Error login (controller):", error.message); // Ubah ini
    res.status(500).json({ message: "❌ Kesalahan saat login!", error: error.message });
  }
};