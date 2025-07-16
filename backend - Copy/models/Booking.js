import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js'; // Pastikan Anda mengimpor model User
import Room from './Room.js'; // Pastikan Anda mengimpor model Room

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Ubah ke false jika user_id wajib
        references: {
            model: User,
            key: 'id',
        },
    },
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Room,
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    guest_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    request: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    check_in: {
        type: DataTypes.DATEONLY, // Menggunakan DATEONLY untuk hanya tanggal
        allowNull: false,
    },
    check_out: {
        type: DataTypes.DATEONLY, // Menggunakan DATEONLY untuk hanya tanggal
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.ENUM('DP', 'LUNAS'),
        defaultValue: 'DP',
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
    },
    total_price: {
        type: DataTypes.INTEGER, 
        allowNull: true, 
        defaultValue: 0,
    },
}, {
    tableName: 'bookings', 
    timestamps: true,
});

// Definisi asosiasi
// PERUBAHAN DI SINI: Menambahkan onDelete: 'CASCADE' secara eksplisit
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
Booking.belongsTo(Room, { foreignKey: 'room_id', as: 'room', onDelete: 'CASCADE' }); // Juga untuk room_id sebagai praktik baik

export default Booking;
