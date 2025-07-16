import Room from "../models/Room.js";
import multer from "multer";
import path from "path";

// ✅ Setup multer untuk upload gambar ke folder public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // pastikan folder ini ada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

/* ========================
   ➕ CREATE ROOM
==========================*/
export const createRoom = async (req, res) => {
  try {
    const { name, type, price } = req.body;
    let imageFile = req.file?.filename; // Gunakan let karena nilainya bisa berubah

    // PERBAIKAN DI SINI: Pastikan string "null" diubah menjadi null
    if (imageFile === "null") {
      imageFile = null;
    }

    if (!name || !type || !price) {
      return res.status(400).json({
        message: "❌ Data kamar tidak lengkap! (nama, tipe, harga wajib diisi)",
      });
    }

    const newRoom = await Room.create({
      name: name.trim(),
      type: type.trim(),
      price: parseInt(price),
      image: imageFile || null, // Jika imageFile masih undefined/kosong, set ke null
    });

    res.status(201).json({
      message: "✅ Kamar berhasil ditambahkan!",
      data: newRoom,
    });
  } catch (error) {
    console.error("❌ Error menambahkan kamar:", error.message);
    res.status(500).json({
      message: "❌ Gagal menambahkan kamar!",
      error: error.message,
    });
  }
};

/* ========================
   📥 GET ALL ROOMS
==========================*/
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      attributes: ["id", "name", "type", "price", "image", "availability"],
    });

    if (!rooms.length) {
      // Mengembalikan array kosong jika tidak ada kamar
      return res.status(200).json([]); 
    }

    // Langsung mengembalikan array kamar
    res.status(200).json(rooms); 
  } catch (error) {
    console.error("❌ Error ambil kamar:", error.message);
    res.status(500).json({
      message: "❌ Gagal ambil kamar!",
      error: error.message,
    });
  }
};

/* ========================
   ✏️ UPDATE ROOM
==========================*/
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ message: "❌ Kamar tidak ditemukan!" });
    }

    const { name, type, price } = req.body;
    let imageFile = req.file?.filename; // Gunakan let

    // PERBAIKAN DI SINI: Pastikan string "null" diubah menjadi null
    if (imageFile === "null") {
      imageFile = null;
    }

    room.name = name?.trim() || room.name;
    room.type = type?.trim() || room.type;
    room.price = price ? parseInt(price) : room.price;
    
    // Hanya perbarui gambar jika imageFile disediakan dan bukan null
    if (imageFile !== undefined) { // Cek jika imageFile dikirim (bisa null jika ingin menghapus)
      room.image = imageFile;
    }

    await room.save();

    res.status(200).json({
      message: "✅ Kamar berhasil diperbarui!",
      data: room,
    });
  } catch (error) {
    console.error("❌ Error update kamar:", error.message);
    res.status(500).json({
      message: "❌ Gagal update kamar!",
      error: error.message,
    });
  }
};

/* ========================
   🗑️ DELETE ROOM
==========================*/
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ message: "❌ Kamar tidak ditemukan!" });
    }

    await room.destroy();

    res.status(200).json({ message: "✅ Kamar berhasil dihapus!" });
  } catch (error) {
    console.error("❌ Error hapus kamar:", error.message);
    res.status(500).json({
      message: "❌ Gagal hapus kamar!",
      error: error.message,
    });
  }
};
