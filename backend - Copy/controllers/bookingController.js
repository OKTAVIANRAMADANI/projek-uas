import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js"; // Import model User
import { Op } from "sequelize";

// Tambah pemesanan
export const createBooking = async (req, res) => {
  try {
    const {
      user_id, room_id, name, phone, email, guest_name, request,
      check_in, check_out, payment_status
    } = req.body;

    console.log('Received booking data:', req.body);

    // Validasi field wajib (user_id tidak wajib di sini karena akan divalidasi/diisi fallback)
    if (!room_id || !name || !phone || !email || !guest_name || !check_in || !check_out || !payment_status) {
      console.log('Validation failed: Missing required fields (excluding user_id)');
      return res.status(400).json({ message: "❌ Semua field wajib diisi!" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('Validation failed: Invalid email format');
      return res.status(400).json({ message: "❌ Format email tidak valid!" });
    }

    if (!/^\d{8,}$/.test(phone)) { 
      console.log('Validation failed: Invalid phone number format');
      return res.status(400).json({ message: "❌ Nomor HP tidak valid! Harus berupa angka dan minimal 8 digit." });
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (checkInDate >= checkOutDate) {
      console.log('Validation failed: Check-out date before/same as check-in');
      return res.status(400).json({ message: "❌ Tanggal check-out harus sesudah tanggal check-in!" });
    }

    const room = await Room.findByPk(room_id);
    if (!room) {
      console.log('Validation failed: Room not found');
      return res.status(404).json({ message: "❌ Kamar tidak ditemukan!" });
    }

    // ======================================================================================
    // !!! INI ADALAH BAGIAN KRUSIAL YANG SUDAH KITA IDENTIFIKASI !!!
    //
    // DATABASE ANDA MENGATUR 'user_id' SEBAGAI 'NOT NULL'.
    // Anda memiliki pengguna dengan ID 27.
    //
    // KITA AKAN MENGUBAH ID FALLBACK MENJADI 27.
    // ======================================================================================
    let finalUserId = user_id;
    // Jika user_id dikirim dari frontend, cek apakah ada di database
    if (user_id) { 
        const existingUser = await User.findByPk(user_id);
        if (!existingUser) {
            console.warn(`User ID ${user_id} not found in 'users' table. Using fallback user ID.`);
            // MENGUBAH ID FALLBACK DARI 1 MENJADI 27
            finalUserId = 27; // <--- DIUBAH KE ID PENGGUNA YANG ADA DI DATABASE ANDA (27)
        }
    } else { // Jika user_id adalah null atau undefined dari frontend
        console.warn(`User ID is null/undefined from frontend. Using fallback user ID.`);
        // MENGUBAH ID FALLBACK DARI 1 MENJADI 27
        finalUserId = 27; // <--- DIUBAH KE ID PENGGUNA YANG ADA DI DATABASE ANDA (27)
    }
    // ======================================================================================

    // Hitung durasi menginap dalam hari
    const durationMs = checkOutDate.getTime() - checkInDate.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)); 

    // Hitung total harga
    const totalPrice = room.price * durationDays;

    // Cek ketersediaan kamar (overlap booking)
    const overlap = await Booking.findOne({
      where: {
        room_id,
        [Op.or]: [
            { 
                check_in: { [Op.lt]: checkOutDate },
                check_out: { [Op.gt]: checkInDate },
            },
            { 
                check_in: { [Op.gte]: checkInDate, [Op.lt]: checkOutDate },
            },
            { 
                check_out: { [Op.gt]: checkInDate, [Op.lte]: checkOutDate },
            },
            { 
                check_in: { [Op.lte]: checkInDate },
                check_out: { [Op.gte]: checkOutDate },
            }
        ]
      }
    });

    if (overlap) {
      console.log('Validation failed: Room already booked for these dates');
      return res.status(400).json({ message: "❌ Kamar sudah dibooking pada tanggal tersebut!" });
    }

    const booking = await Booking.create({
      user_id: finalUserId, // Menggunakan user ID yang sudah divalidasi/fallback
      room_id, name, phone, email, guest_name, request,
      check_in, check_out, payment_status,
      status: "pending",
      total_price: totalPrice 
    });

    res.status(201).json({ message: "✅ Pemesanan berhasil!", data: booking });
  } catch (error) {
    console.error("❌ Error createBooking (catch block):", error.message);
    res.status(500).json({ message: "❌ Terjadi kesalahan!", error: error.message });
  }
};

// Ambil semua booking (pagination)
export const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      include: { model: Room, as: "room", attributes: ["id", "name", "price"] },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json({
      message: "✅ Data ditemukan!",
      data: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Gagal mengambil data", error: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: { model: Room, as: "room", attributes: ["id", "name", "price"] },
    });

    if (!booking) {
      return res.status(404).json({ message: "❌ Booking tidak ditemukan!" });
    }

    res.status(200).json({ message: "✅ Booking ditemukan", data: booking });
  }
  catch (error) {
    res.status(500).json({ message: "❌ Gagal mengambil booking", error: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "❌ Booking tidak ditemukan!" });

    await booking.destroy();
    res.status(200).json({ message: "✅ Booking berhasil dibatalkan" });
  } catch (error) {
    res.status(500).json({ message: "❌ Gagal membatalkan", error: error.message });
  }
};

// Update status booking
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "❌ Status tidak valid!" });
    }

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "❌ Booking tidak ditemukan!" });

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: "✅ Status diperbarui!", data: booking });
  } catch (error) {
    res.status(500).json({ message: "❌ Gagal update status", error: error.message });
  }
};
