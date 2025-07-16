import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js"; // Diperlukan jika Anda ingin melakukan validasi booking_id

export const createPayment = async (req, res) => {
  console.log("✅ BODY DITERIMA:", req.body);

  try {
    const {
      booking_id,
      room,
      name,
      guest_name, // PERBAIKAN: Menggunakan guest_name sesuai yang dikirim frontend
      email,
      check_in,
      check_out,
      duration,
      request,
      price,
      total, // Ini adalah totalPrice dari frontend
      bank,
      rekening, // Ini adalah string nomor rekening dari frontend
      image,
      method, // Ini adalah selectedBank dari frontend
      status, // Ini adalah status 'Pending' dari frontend
    } = req.body;

    // Validasi semua field WAJIB diisi
    // PERBAIKAN: Validasi rekening.nama dan rekening.nomor dihapus karena 'rekening' sekarang string
    // PERBAIKAN: guest diganti jadi guest_name
    if (
      !booking_id ||
      !room ||
      !name ||
      !guest_name || // Menggunakan guest_name
      !email ||
      !check_in ||
      !check_out ||
      !price ||
      !total || // totalFinal dari frontend
      !bank ||
      !rekening // Nomor rekening (string)
      // !rekening.nama || // Dihapus
      // !rekening.nomor // Dihapus
    ) {
      console.log("❌ Data tidak lengkap:", {
        booking_id,
        room,
        name,
        guest_name, // Menggunakan guest_name
        email,
        check_in,
        check_out,
        price,
        total,
        bank,
        rekening,
      });
      return res.status(400).json({
        message: "❌ Data pembayaran tidak lengkap! Pastikan semua field wajib terisi.",
      });
    }

    // Opsional: Validasi booking_id ada di tabel Booking
    const existingBooking = await Booking.findByPk(booking_id);
    if (!existingBooking) {
      return res.status(404).json({ message: "❌ Booking dengan ID tersebut tidak ditemukan!" });
    }

    console.log("✅ Semua field valid, membuat payment...");

    const payment = await Payment.create({
      booking_id, 
      room,
      name,
      guest_name, // Menggunakan guest_name
      email,
      check_in,
      check_out,
      duration,
      request,
      price,
      total,
      bank,
      rekening_name: req.body.rekening_name, // Mengambil rekening_name dari body asli
      rekening_number: rekening, // Menggunakan 'rekening' yang merupakan nomor rekening
      image,
      method: method || "Transfer", // Menggunakan method dari frontend atau default "Transfer"
      status: status || "Pending", // Menggunakan status dari frontend atau default "Pending"
    });

    console.log("✅ Payment berhasil dibuat:", payment);

    res.status(201).json({
      message: "✅ Pembayaran berhasil disimpan!",
      data: payment,
    });

  } catch (err) {
    console.error("❌ Gagal menyimpan pembayaran:", err);
    res.status(500).json({
      message: "❌ Gagal menyimpan pembayaran!",
      error: err.message,
    });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json({
      message: "✅ Data pembayaran diambil!",
      data: payments,
    });
  } catch (err) {
    console.error("❌ Gagal mengambil data pembayaran:", err);
    res.status(500).json({
      message: "❌ Gagal mengambil data pembayaran!",
      error: err.message,
    });
  }
};
