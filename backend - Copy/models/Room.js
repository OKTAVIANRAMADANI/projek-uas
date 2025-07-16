import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Room = sequelize.define("Room", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    comment: "Nama kamar"
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    comment: "Tipe kamar"
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0,
    },
    comment: "Harga kamar"
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: "Status ketersediaan"
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Nama file gambar kamar (misal: kamar1.jpg)"
  },
}, {
  tableName: "rooms",
  timestamps: true,              // Aktifkan createdAt & updatedAt
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Room;
