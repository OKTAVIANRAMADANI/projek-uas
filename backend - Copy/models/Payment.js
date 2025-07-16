import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Booking from "./Booking.js"; // <-- pastikan path ini betul

const Payment = sequelize.define("Payment", {
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Booking,     // FK ke tabel Booking
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: DataTypes.STRING,
  guest_name: DataTypes.STRING,
  email: DataTypes.STRING,
  check_in: DataTypes.DATE,
  check_out: DataTypes.DATE,
  duration: DataTypes.INTEGER,
  request: DataTypes.TEXT,
  price: DataTypes.INTEGER,
  total: DataTypes.INTEGER,
  bank: DataTypes.STRING,
  rekening_name: DataTypes.STRING,
  rekening_number: DataTypes.STRING,
  image: DataTypes.STRING,
  method: {
    type: DataTypes.STRING,
    defaultValue: "Transfer",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
});

// ✅ Relasi: 1 Booking bisa punya banyak Payment
Payment.belongsTo(Booking, {
  foreignKey: "booking_id",
  as: "booking",
});

export default Payment;