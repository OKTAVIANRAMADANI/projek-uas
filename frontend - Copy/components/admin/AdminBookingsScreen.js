import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

export default function AdminBookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // PENTING: Pastikan ini adalah IP lokal komputer Anda dan port backend (5000)
  const API_BASE_URL = 'http://192.168.1.11:5000'; 

  // Fungsi untuk mengambil semua pemesanan dari backend
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings`);
      // Backend Anda mengembalikan { data: rows, total: count, ... }
      // Kita hanya tertarik pada array 'rows' yang berisi data booking
      if (response.data && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
      } else {
        console.error('❌ Backend response for /api/bookings is not in expected format:', response.data);
        setError('❌ Format data pemesanan tidak valid dari server.');
      }
    } catch (err) {
      console.error('❌ Error fetching bookings:', err?.response?.data || err.message);
      setError('❌ Gagal memuat daftar pemesanan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []); // Panggil sekali saat komponen dimuat

  // Fungsi untuk menampilkan detail booking (opsional, bisa dinavigasi ke layar lain)
  const handleViewDetails = (booking) => {
    Alert.alert(
      'Detail Pemesanan',
      `ID Booking: ${booking.id}\n` +
      `Kamar: ${booking.room ? booking.room.name : 'N/A'}\n` +
      `Pemesan: ${booking.name}\n` +
      `Tamu: ${booking.guest_name}\n` +
      `Check-in: ${booking.check_in}\n` +
      `Check-out: ${booking.check_out}\n` +
      `Total Harga: Rp ${booking.total_price?.toLocaleString('id-ID') || 'N/A'}\n` +
      `Status: ${booking.status}\n` +
      `Pembayaran: ${booking.payment_status}`,
      [{ text: 'OK' }]
    );
  };

  // Fungsi untuk menghapus pemesanan
  const handleDeleteBooking = (bookingId) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus pemesanan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/api/bookings/${bookingId}`);
              Alert.alert('Sukses', '✅ Pemesanan berhasil dihapus!');
              fetchBookings(); // Refresh daftar pemesanan
            } catch (err) {
              console.error('❌ Error deleting booking:', err?.response?.data || err.message);
              Alert.alert('Gagal', err.response?.data?.message || '❌ Gagal menghapus pemesanan!');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0056b3" />
        <Text style={styles.loadingText}>Memuat pemesanan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchBookings}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Daftar Pemesanan</Text>

      {bookings.length === 0 ? (
        <Text style={styles.emptyText}>Tidak ada pemesanan ditemukan.</Text>
      ) : (
        bookings.map((booking) => (
          <TouchableOpacity 
            key={booking.id} 
            style={styles.bookingCard} 
            onPress={() => handleViewDetails(booking)} // Tetap bisa melihat detail
          >
            <View style={styles.cardHeader}>
              <Text style={styles.bookingId}>Booking ID: {booking.id}</Text>
              <Text style={[
                styles.bookingStatus,
                booking.status === 'confirmed' && styles.statusConfirmed,
                booking.status === 'pending' && styles.statusPending,
                booking.status === 'cancelled' && styles.statusCancelled,
              ]}>
                {booking.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.roomName}>Kamar: {booking.room ? booking.room.name : 'N/A'}</Text>
            <Text style={styles.customerName}>Pemesan: {booking.name}</Text>
            <Text style={styles.dates}>Check-in: {booking.check_in}</Text>
            <Text style={styles.dates}>Check-out: {booking.check_out}</Text>
            <Text style={styles.totalPrice}>Total: Rp {booking.total_price?.toLocaleString('id-ID') || 'N/A'}</Text>
            
            {/* Tombol Hapus */}
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleDeleteBooking(booking.id)}
            >
              <Text style={styles.deleteButtonText}>Hapus Pemesanan</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  statusConfirmed: {
    backgroundColor: '#d4edda',
    color: '#28a745',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#ffc107',
  },
  statusCancelled: {
    backgroundColor: '#f8d7da',
    color: '#dc3545',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  customerName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  dates: {
    fontSize: 14,
    color: '#777',
    marginBottom: 3,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077cc',
    marginTop: 10,
  },
  button: { // Gaya umum untuk tombol coba lagi
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: { // Gaya teks tombol umum
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: { // Gaya tombol hapus
    backgroundColor: '#dc3545', // Merah
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-end', // Posisikan di kanan bawah kartu
    marginTop: 10,
  },
  deleteButtonText: { // Gaya teks tombol hapus
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
