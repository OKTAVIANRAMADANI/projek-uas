import bcrypt from "bcryptjs";
import { sequelize } from "../config/db.js";
import Admin from "../models/Admin.js";

const createAdmin = async () => {
  try {
    const email = "admin2@gmail.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log("✅ Admin berhasil dibuat!");
  } catch (error) {
    console.error("❌ Gagal membuat admin:", error.message);
  } finally {
    await sequelize.close();
  }
};

createAdmin();
