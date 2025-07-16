import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function PaymentDetailScreen({ route, navigation }) {
  // Terima semua data yang dikirim BookingScreen
  const {
    bookingId,
    roomId,
    roomName,
    price, // Ini adalah harga per malam
    image, // Ini adalah URL gambar
    checkin,
    checkout,
    name,
    phone,
    email,
    guest, // Nama tamu dari BookingScreen
    request,
    payment_status, // Status pembayaran dari BookingScreen
    totalPrice, // <<< Menerima totalPrice dari BookingScreen
  } = route.params || {};

  // Hitung durasi malam (tetap di frontend untuk tampilan)
  const d1 = new Date(checkin);
  const d2 = new Date(checkout);
  const duration = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💳 Detail Pembayaran</Text>

      {/* Menampilkan gambar kamar dari URL */}
      {image ? (
        <Image source={{ uri: image }} style={styles.roomImage} onError={(e) => console.log('Image loading error:', e.nativeEvent.error)} />
      ) : (
        <View style={styles.roomImagePlaceholder}>
          <Text style={styles.roomImagePlaceholderText}>No Image</Text>
        </View>
      )}
      
      <Text style={styles.roomName}>{roomName}</Text>
      <Text style={styles.roomFacilities}>Fan, TV, AC, WiFi, Coffee Morning</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Detail Booking</Text>
        <Text>Check-in: {checkin}</Text>
        <Text>Check-out: {checkout}</Text>
        <Text>Durasi: {duration} malam</Text>
        <Text>Jumlah Kamar: 1</Text>

        <View style={styles.separator} />

        <Text>Nama Pemesan: {name}</Text>
        <Text>Nomor HP: {phone}</Text>
        <Text>Email: {email}</Text>
        <Text>Nama Tamu: {guest || '-'}</Text> {/* Tambahkan fallback jika guest undefined */}
        <Text>Permintaan Khusus: {request || '-'}</Text>
        <Text>Status Pembayaran: {payment_status}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Rincian Harga</Text>
        <Text>Harga per malam: Rp {price?.toLocaleString('id-ID')}</Text>
        <Text>Durasi: {duration} malam</Text>
        <Text>Biaya Layanan: Rp 10.000</Text>
        {/* Menampilkan total harga yang diterima dari backend */}
        <Text style={styles.total}>Total: Rp {totalPrice?.toLocaleString('id-ID')}</Text> 
      </View>

      {/* Tombol untuk melanjutkan ke layar Pembayaran */}
      <TouchableOpacity
        style={styles.button} 
        onPress={() =>
          navigation.navigate('Payment', {
            bookingId,
            roomId,
            roomName,
            price, // Harga per malam
            image,
            checkin,
            checkout,
            name,
            phone,
            email,
            guest, // <<< PASTIKAN 'guest' DIKIRIM KE LAYAR PAYMENT
            request,
            payment_status,
            totalPrice, // <<< PASTIKAN 'totalPrice' DIKIRIM KE LAYAR PAYMENT
          })
        }
      >
        <Text style={styles.buttonText}>Lanjut ke Pembayaran</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  roomImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  roomImagePlaceholder: { 
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomImagePlaceholderText: { 
    color: '#888',
    fontSize: 16,
  },
  roomName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
    textAlign: 'center',
  },
  roomFacilities: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoBox: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    color: '#0077cc',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
  total: {
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 16,
    color: '#d32f2f',
  },
  button: { 
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: { 
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
