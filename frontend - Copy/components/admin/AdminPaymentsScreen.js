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

export default function AdminPaymentsScreen({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // PENTING: Pastikan ini adalah IP lokal komputer Anda dan port backend (5000)
  const API_BASE_URL = 'http://192.168.1.11:5000'; 

  // Fungsi untuk mengambil semua pembayaran dari backend
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/payments`);
      // Asumsi backend Anda mengembalikan array pembayaran langsung atau di properti 'data'
      if (Array.isArray(response.data.data)) { // Jika backend mengembalikan { data: [...] }
        setPayments(response.data.data);
      } else if (Array.isArray(response.data)) { // Jika backend mengembalikan array langsung
        setPayments(response.data);
      } else {
        console.error('❌ Backend response for /api/payments is not in expected format:', response.data);
        setError('❌ Format data pembayaran tidak valid dari server.');
      }
    } catch (err) {
      console.error('❌ Error fetching payments:', err?.response?.data || err.message);
      setError('❌ Gagal memuat daftar pembayaran. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []); // Panggil sekali saat komponen dimuat

  // Fungsi untuk menampilkan detail pembayaran (opsional, bisa dinavigasi ke layar lain)
  const handleViewDetails = (payment) => {
    Alert.alert(
      'Detail Pembayaran',
      `ID Pembayaran: ${payment.id}\n` +
      `Booking ID: ${payment.booking_id}\n` +
      `Kamar: ${payment.room || 'N/A'}\n` +
      `Pemesan: ${payment.name || 'N/A'}\n` +
      `Tamu: ${payment.guest_name || 'N/A'}\n` +
      `Check-in: ${payment.check_in}\n` +
      `Check-out: ${payment.check_out}\n` +
      `Total: Rp ${payment.total?.toLocaleString('id-ID') || 'N/A'}\n` +
      `Metode: ${payment.method || 'N/A'}\n` +
      `Bank: ${payment.bank || 'N/A'}\n` +
      `No. Rek: ${payment.rekening_number || 'N/A'}\n` +
      `Status: ${payment.status}`,
      [{ text: 'OK' }]
    );
    // TODO: Anda bisa menavigasi ke layar 'PaymentDetailAdmin' di sini jika Anda membuatnya
    // navigation.navigate('PaymentDetailAdmin', { paymentId: payment.id });
  };

  // Fungsi untuk menghapus pembayaran
  const handleDeletePayment = (paymentId) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus pembayaran ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/api/payments/${paymentId}`);
              Alert.alert('Sukses', '✅ Pembayaran berhasil dihapus!');
              fetchPayments(); // Refresh daftar pembayaran
            } catch (err) {
              console.error('❌ Error deleting payment:', err?.response?.data || err.message);
              Alert.alert('Gagal', err.response?.data?.message || '❌ Gagal menghapus pembayaran!');
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
        <Text style={styles.loadingText}>Memuat pembayaran...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchPayments}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💳 Daftar Pembayaran Masuk</Text>

      {payments.length === 0 ? (
        <Text style={styles.emptyText}>Tidak ada pembayaran ditemukan.</Text>
      ) : (
        payments.map((payment) => (
          <TouchableOpacity 
            key={payment.id} 
            style={styles.paymentCard} 
            onPress={() => handleViewDetails(payment)} // Tetap bisa melihat detail
          >
            <View style={styles.cardHeader}>
              <Text style={styles.paymentId}>ID Pembayaran: {payment.id}</Text>
              <Text style={[
                styles.paymentStatus,
                payment.status === 'Confirmed' && styles.statusConfirmed, // Asumsi status 'Confirmed'
                payment.status === 'Pending' && styles.statusPending, // Asumsi status 'Pending'
                payment.status === 'Failed' && styles.statusCancelled, // Asumsi status 'Failed'
              ]}>
                {payment.status?.toUpperCase() || 'N/A'}
              </Text>
            </View>
            <Text style={styles.bookingInfo}>Booking ID: {payment.booking_id}</Text>
            <Text style={styles.bookingInfo}>Kamar: {payment.room || 'N/A'}</Text>
            <Text style={styles.customerName}>Pemesan: {payment.name || 'N/A'}</Text>
            <Text style={styles.totalPrice}>Total: Rp {payment.total?.toLocaleString('id-ID') || 'N/A'}</Text>
            <Text style={styles.methodInfo}>Metode: {payment.method || 'N/A'} ({payment.bank || 'N/A'})</Text>
            
            {/* Tombol Hapus */}
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleDeletePayment(payment.id)}
            >
              <Text style={styles.deleteButtonText}>Hapus Pembayaran</Text>
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
  paymentCard: { // Gaya untuk kartu pembayaran
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
  paymentId: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  statusConfirmed: { // Gaya untuk status 'Confirmed'
    backgroundColor: '#d4edda',
    color: '#28a745',
  },
  statusPending: { // Gaya untuk status 'Pending'
    backgroundColor: '#fff3cd',
    color: '#ffc107',
  },
  statusCancelled: { // Gaya untuk status 'Failed' (menggunakan gaya cancelled sebagai fallback)
    backgroundColor: '#f8d7da',
    color: '#dc3545',
  },
  bookingInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077cc',
    marginTop: 5,
    marginBottom: 5,
  },
  methodInfo: {
    fontSize: 14,
    color: '#777',
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
